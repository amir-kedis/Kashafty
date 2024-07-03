import { Request, Response } from "express";
import { prisma } from "../database/db";

const alertController = {
  getAlert: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;

      const alert = await prisma.notification.findMany({
        where: {
          notificationId: parseInt(id),
          RecieveNotification: {
            some: {
              captainId: req.captain?.captainId,
            },
          },
        },
        include: {
          RecieveNotification: true,
        },
      });

      if (!alert) {
        return res.status(404).json({ error: "Alert not found" });
      }

      return res.status(200).json({
        message: "Alert successfully found",
        body: alert,
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

      const alert = await prisma.notification.create({
        data: {
          message,
          timestamp: new Date(),
          contentType,
        },
      });

      return res.status(200).json({
        message: "Alert successfully created",
        body: alert,
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

      let result: any = await prisma.notification.findUnique({
        where: {
          notificationId: parseInt(id),
        },
      });

      if (!result) {
        return res.status(404).json({ error: "Alert not found" });
      }

      if (!sectorBaseName || !sectorSuffixName) {
        const captains = await prisma.captain.findMany({
          select: { captainId: true },
        });

        result = await prisma.recieveNotification.createMany({
          data: captains.map((captain) => ({
            notificationId: parseInt(id),
            captainId: captain.captainId,
            status: "unread",
          })),
        });
      } else {
        const captains = await prisma.captain.findMany({
          where: {
            rSectorBaseName: sectorBaseName,
            rSectorSuffixName: sectorSuffixName,
          },
          select: { captainId: true },
        });

        result = await prisma.recieveNotification.createMany({
          data: captains.map((captain) => ({
            notificationId: parseInt(id),
            captainId: captain.captainId,
            status: "unread",
          })),
        });
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

      const result = await prisma.notification.delete({
        where: {
          notificationId: parseInt(id),
        },
      });
      return res.status(200).json({
        message: "Alert successfully deleted",
        body: result,
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

      const result = await prisma.recieveNotification.updateMany({
        where: {
          notificationId: parseInt(id),
          captainId: req.captain?.captainId,
        },
        data: {
          status: "read",
        },
      });

      if (!result.count) {
        return res.status(404).json({ error: "Alert not found" });
      }

      return res.status(200).json({
        message: "Alert status successfully updated",
        body: result,
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

      // const result = await db.query(
      //   `SELECT N.*, R."status"
      //    FROM "Notification" AS N, "RecieveNotification" AS R
      //    WHERE N."notificationId" = R."notificationId" AND
      //          R."captainId" = $1
      //    ORDER BY N."timestamp" DESC;`,
      //   [req.captain?.captainId],
      // );
      //
      // let alerts = result.rows;

      let alerts = await prisma.notification.findMany({
        where: {
          RecieveNotification: {
            some: {
              captainId: req.captain?.captainId,
            },
          },
        },
        orderBy: {
          timestamp: "desc",
        },
        select: {
          notificationId: true,
          message: true,
          timestamp: true,
          contentType: true,
          RecieveNotification: {
            select: {
              status: true,
            },
            where: {
              captainId: req.captain?.captainId,
            },
          },
        },
      });

      if (status !== "all") {
        alerts = alerts.filter(
          (alert) => alert.RecieveNotification[0].status === status,
        );
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
