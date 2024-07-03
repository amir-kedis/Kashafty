import { Request, Response } from "express";
import db from "../database/db";

const alertController = {
  getAlert: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;

      // get alert
      const result = await db.query(
        `SELECT N.*
         FROM "Notification" AS N, "RecieveNotification" AS R
         WHERE N."notificationId" = R."notificationId" AND
               R."captainId" = $1 AND
               N."notificationId" = $2;`,
        [req.captain?.captainId, id],
      );

      if (!result.rowCount) {
        return res.status(404).json({ error: "Alert not found" });
      }

      return res.status(200).json({
        message: "Alert successfully found",
        body: result.rows[0],
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "An error occurred while getting alert",
      });
    }
  },

  createAlert: async (req: Request, res: Response): Promise<any> => {
    try {
      const { message, contentType } = req.body;

      const result = await db.query(
        `INSERT INTO "Notification" ("timestamp", "message", "contentType")
         VALUES(NOW(), $1, $2) RETURNING *;`,
        [message, contentType],
      );

      return res.status(200).json({
        message: "Alert successfully created",
        body: result.rows[0],
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "An error occurred while creating alert",
      });
    }
  },

  sendAlert: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const { sectorBaseName, sectorSuffixName } = req.body;

      let result = await db.query(
        `SELECT EXISTS (
           SELECT 1
           FROM "Notification"
           WHERE "notificationId" = $1
         ) AS exist;`,
        [id],
      );

      if (!result.rows[0].exist) {
        return res.status(404).json({ error: "Alert not found" });
      }

      if (!sectorBaseName || !sectorSuffixName) {
        // send alert to all captains
        result = await db.query(
          `INSERT INTO "RecieveNotification" ("notificationId", "captainId", "status")
           (SELECT $1::integer, C."captainId", 'unread'::"NotificationStatus"
            FROM "Captain" AS C)
           RETURNING *;`,
          [id],
        );
      } else {
        // check if sector exists
        result = await db.query(
          `SELECT EXISTS (
             SELECT 1
             FROM "Sector"
             WHERE "baseName" = $1 AND
                   "suffixName" = $2
           ) AS exist;`,
          [sectorBaseName, sectorSuffixName],
        );

        if (!result.rows[0].exist) {
          return res.status(404).json({ error: "Sector not found" });
        }

        // send alert to all captains in sector
        result = await db.query(
          `INSERT INTO "RecieveNotification" ("notificationId", "captainId", "status")
           ((SELECT $1::integer, C."captainId", 'unread'::"NotificationStatus"
             FROM "Captain" AS C
             WHERE C."rSectorBaseName" = $2 AND
                   C."rSectorSuffixName" = $3)
            UNION
            (SELECT $1::integer, S."unitCaptainId", 'unread'::"NotificationStatus"
             FROM "Sector" AS S
             WHERE S."baseName" = $2 AND
                   S."suffixName" = $3))
           RETURNING *;`,
          [id, sectorBaseName, sectorSuffixName],
        );
      }

      return res.status(200).json({
        message: "Alert successfully sent",
        body: result.rows,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "An error occurred while sending alert",
      });
    }
  },

  deleteAlert: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;

      const result = await db.query(
        `DELETE FROM "Notification" WHERE "notificationId" = $1 RETURNING *;`,
        [id],
      );

      return res.status(200).json({
        message: "Alert successfully deleted",
        body: result.rows[0],
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "An error occurred while deleting alert",
      });
    }
  },

  updateStatus: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;

      const result = await db.query(
        `UPDATE "RecieveNotification"
         SET "status" = 'read'
         WHERE "notificationId" = $1 AND
               "captainId" = $2
         RETURNING *;`,
        [id, req.captain?.captainId],
      );

      if (!result.rowCount) {
        return res.status(404).json({ error: "Alert not found" });
      }

      return res.status(200).json({
        message: "Alert status successfully updated",
        body: result.rows[0],
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "An error occurred while updating alert status",
      });
    }
  },

  getAllAlerts: async (req: Request, res: Response): Promise<any> => {
    try {
      const { status, contentType } = req.query;

      const result = await db.query(
        `SELECT N.*, R."status"
         FROM "Notification" AS N, "RecieveNotification" AS R
         WHERE N."notificationId" = R."notificationId" AND
               R."captainId" = $1
         ORDER BY N."timestamp" DESC;`,
        [req.captain?.captainId],
      );

      let alerts = result.rows;
      if (status !== "all") {
        alerts = alerts.filter((alert) => alert.status === status);
      }
      if (contentType !== "all") {
        alerts = alerts.filter((alert) => alert.contentType === contentType);
      }

      return res.status(200).json({
        message: "Get alerts successfully",
        body: alerts,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "An error occurred while getting alerts",
      });
    }
  },
};

export default alertController;
