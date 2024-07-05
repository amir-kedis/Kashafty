import cron from "node-cron";
import prisma from "./db";
import { Captain } from "@prisma/client";

interface Scout {
  scoutId: number;
  firstName: string;
  middleName: string;
  [key: string]: any; // Add other fields as needed
}

// Run the cron job every Sunday at 00:00
const newWeekScheduler = cron.schedule("0 0 * * 0", async () => {
  try {
    // Get the current date
    const currentDate = new Date();

    const currentTerm = await prisma.term.findFirst({
      orderBy: {
        termNumber: "desc",
      },
    });

    if (
      !currentTerm ||
      currentTerm.endDate <= currentDate ||
      currentTerm.startDate > currentDate
    )
      return;

    const currentTermNumber = currentTerm.termNumber;

    // Get the current week
    const currentWeek = await prisma.week.findFirst({
      where: {
        termNumber: currentTermNumber,
      },
      orderBy: {
        weekNumber: "desc",
      },
    });
    const currentWeekNumber = currentWeek ? currentWeek.weekNumber : 0;

    // Add a new week
    //);
    const newWeek = await prisma.week.create({
      data: {
        weekNumber: currentWeekNumber + 1,
        cancelled: false,
        startDate: currentDate,
        termNumber: currentTermNumber,
      },
    });
    console.log(
      `Added week ${newWeek.weekNumber} for term ${currentTermNumber}`,
    );

    // Send notification if absence is less than 50%
    let scouts: Scout[] = await prisma.$queryRaw`WITH AttendanceCounts AS (
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
                    SA."termNumber" = ${currentTermNumber}
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
                );`;

    for (const scout of scouts) {
      const message = `نسبة 50% من الغياب الكلي ${scout.firstName} ${scout.middleName} لقد تخطى الكشاف`;

      const generalCaptains: Captain[] = await prisma.captain.findMany({
        where: {
          type: "general",
        },
      });

      await prisma.notification.createMany({
        data: generalCaptains.map((captain: Captain) => ({
          message,
          contentType: "attendance",
          timestamp: currentDate,
          RecieveNotification: {
            create: {
              captainId: captain.captainId,
              status: "unread",
            },
          },
        })),
      });

      console.log(
        `Sent notification for ${scout.firstName} ${scout.middleName}`,
      );
    }
  } catch (error) {
    console.log(error);
  }
});

export default newWeekScheduler;
