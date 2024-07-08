/* ============================================================================
 *
 *
 *  ███╗   ██╗ ██████╗ ████████╗    ███████╗██╗   ██╗███████╗
 *  ████╗  ██║██╔═══██╗╚══██╔══╝    ██╔════╝╚██╗ ██╔╝██╔════╝
 *  ██╔██╗ ██║██║   ██║   ██║       ███████╗ ╚████╔╝ ███████╗
 *  ██║╚██╗██║██║   ██║   ██║       ╚════██║  ╚██╔╝  ╚════██║
 *  ██║ ╚████║╚██████╔╝   ██║██╗    ███████║   ██║   ███████║██╗
 *  ╚═╝  ╚═══╝ ╚═════╝    ╚═╝╚═╝    ╚══════╝   ╚═╝   ╚══════╝╚═╝
 *
 *  Simple notification controller
 *  This controller is responsible for handling all notification related
 *
 *  Author: Amir Kedis
 *
 */

import { Request, Response } from "express";
import { prisma } from "../database/db";
import { NotificationStatus, NotificationType, Prisma } from "@prisma/client";

const notificationController = {
  /* sendNotification
   *
   * @desc Send a notification to a group of users, or all users
   * @endpoint POST /api/notification
   * @access Private
   */
  sendNotification: async (req: Request, res: Response) => {
    try {
      const { type, title, message, sectorBaseName, sectorSuffixName } =
        req.body;

      if (!type || !title || !message)
        return res.status(400).json({ message: "Missing required fields" });

      let isToAll = false;
      if (!sectorBaseName && !sectorSuffixName) isToAll = true;

      let sentNotifications: Prisma.BatchPayload;

      if (isToAll) {
        const userIds = await prisma.captain.findMany({
          select: {
            captainId: true,
          },
        });

        sentNotifications = await prisma.notification.createMany({
          data: userIds.map((user) => ({
            captainId: user.captainId,
            title,
            message,
            type,
            status: NotificationStatus.UNREAD,
          })),
        });
      } else {
        const userIds = await prisma.captain.findMany({
          select: {
            captainId: true,
          },
          where: {
            rSectorBaseName: sectorBaseName,
            rSectorSuffixName: sectorSuffixName,
          },
        });

        sentNotifications = await prisma.notification.createMany({
          data: userIds.map((user) => ({
            captainId: user.captainId,
            title,
            message,
            type,
            status: NotificationStatus.UNREAD,
          })),
        });
      }

      res
        .status(200)
        .json({ message: `Notification sent to ${sentNotifications.count}` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  /* getNotification
   *
   * @desc Get all notifications for a specific user
   * @endpoint GET /api/notification
   * @access Private
   */
  getNotification: async (req: Request, res: Response) => {
    try {
      const { captainId, status: statusStr, type: typeStr } = req.query;

      const status = statusStr as NotificationStatus;
      const type = typeStr as NotificationType;

      console.log({ captainId, status, type });

      const notifications = await prisma.notification.findMany({
        where: {
          captainId: parseInt(captainId as string),
          status: status || NotificationStatus.UNREAD,
          type: type || undefined,
        },
      });

      res
        .status(200)
        .json({ message: "Notifications fetched", body: notifications });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  /* updateNotification
   *
   * @desc Update the status of a notification
   * @endpoint PATCH /api/notification
   * @access Private
   */
  updateNotification: async (req: Request, res: Response) => {
    try {
      const { id: idStr, status } = req.body;
      const id = parseInt(idStr);

      if (!status)
        return res.status(400).json({ message: "Missing required fields" });

      const updatedNotification = await prisma.notification.update({
        where: {
          id,
        },
        data: {
          status,
        },
      });

      res
        .status(200)
        .json({ message: "Notification updated", body: updatedNotification });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  /* deleteNotification
   *
   * @desc Delete a notification
   * @endpoint DELETE /api/notification
   * @access Private
   */
  deleteNotification: async (req: Request, res: Response) => {
    try {
      const { id: idStr } = req.body;
      const id = parseInt(idStr);

      console.log({ id });

      await prisma.notification.delete({
        where: {
          id,
        },
      });

      res.status(200).json({ message: "Notification deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default notificationController;
