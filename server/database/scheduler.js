import cron from "node-cron";
import db from "./db.js";

// Run the cron job every Sunday at 00:00
const newWeekScheduler = cron.schedule("0 0 * * 0", async () => {
  try {
    // Get the current date
    const currentDate = new Date();

    // Get the current term
    let result = await db.query(
      `SELECT * FROM "Term" WHERE "termNumber" IN 
            (SELECT COALESCE(MAX("termNumber"), 0) FROM "Term");`,
    );
    if (
      !result.rows.length ||
      result.rows[0].endDate <= currentDate ||
      result.rows[0].startDate > currentDate
    )
      return;

    const currentTermNumber = result.rows[0].termNumber;

    // Get the current week
    result = await db.query(
      `SELECT COALESCE(MAX("weekNumber"), 0) AS max FROM "Week" WHERE "termNumber" = $1;`,
      [currentTermNumber],
    );
    const currentWeekNumber = result.rows[0].max;

    // Add a new week
    result = await db.query(
      `INSERT INTO "Week"
            VALUES ($1, $2, $3, $4)
            RETURNING *;`,
      [currentWeekNumber + 1, false, currentDate, currentTermNumber],
    );

    // Send notification if absence is less than 50%
    result = await db.query(
      `WITH AttendanceCounts AS (
                SELECT
                    SA."scoutId",
                    COUNT(*) FILTER (WHERE SA."attendanceStatus" = 'absent') AS absence_count,
                    COUNT(*) FILTER (WHERE SA."attendanceStatus" = 'attended') AS attendance_count
                FROM
                    "ScoutAttendance" AS SA
                    JOIN "Week" AS W ON SA."weekNumber" = W."weekNumber" AND SA."termNumber" = W."termNumber"
                    JOIN "Scout" AS SC ON SA."scoutId" = SC."scoutId"
                WHERE
                    W."cancelled" = false AND
                    SA."termNumber" = $1
                GROUP BY
                    SA."scoutId"
            )
            SELECT *
            FROM
                "Scout"
            WHERE
                "scoutId" IN (
                    SELECT "scoutId"
                    FROM AttendanceCounts
                    WHERE absence_count / (absence_count + attendance_count) < 0.5
                );`,
      [currentTermNumber],
    );
    const scouts = result.rows;

    for (const scout of scouts) {
      const message = `نسبة 50% من الغياب الكلي ${scout.firstName} ${scout.middleName} لقد تخطى الكشاف`;
      result = await db.query(
        `INSERT INTO "Notification" ("timestamp", "message", "contentType")
                VALUES(NOW(), $1, 'attendance') RETURNING *;`,
        [message],
      );
      const alert = result.rows[0];

      result = await db.query(
        `INSERT INTO "RecieveNotification" ("notificationId", "captainId", "status")
                (SELECT $1::integer, C."captainId", 'unread'::"NotificationStatus"
                FROM "Captain" AS C
                WHERE C."type" = 'general');`,
        [alert.notificationId],
      );
    }
  } catch (error) {
    console.log(error);
  }
});

export default newWeekScheduler;
