import { Request, Response } from "express";
import { prisma } from "../database/db";
import { NotificationStatus, NotificationType, Prisma } from "@prisma/client";
import asyncDec from "../utils/asyncDec";
import AppError from "../utils/AppError";

// Define a custom Request type that includes the captain property
interface AuthenticatedRequest extends Request {
  captain?: {
    captainId: number;
    type: string;
    [key: string]: any;
  };
}

const notificationController = {
  /* ============================================================================
   *
   *  ███╗   ██╗ ██████╗ ████████╗    ███████╗██╗   ██╗███████╗
   *  ████╗  ██║██╔═══██╗╚══██╔══╝    ██╔════╝╚██╗ ██╔╝██╔════╝
   *  ██╔██╗ ██║██║   ██║   ██║       ███████╗ ╚████╔╝ ███████╗
   *  ██║╚██╗██║██║   ██║   ██║       ╚════██║  ╚██╔╝  ╚════██║
   *  ██║ ╚████║╚██████╔╝   ██║██╗    ███████║   ██║   ███████║██╗
   *  ╚═╝  ╚═══╝ ╚═════╝    ╚═╝╚═╝    ╚══════╝   ╚═╝   ╚══════╝╚═╝
   *
   *  Simple notification controller
   *  This controller is responsible for handling all notification-related
   *
   *  Author: Amir Kedis
   *
   * ============================================================================ */

  /* sendNotification
   *
   * @desc Send a notification to a group of users, or all users
   * @endpoint POST /api/notification
   * @access Private
   */
  sendNotification: asyncDec(async (req: Request, res: Response) => {
    const { type, title, message, sectorBaseName, sectorSuffixName } = req.body;

    if (!type || !title || !message) {
      throw new AppError(400, "Missing required fields", "حقل مطلوب مفقود");
    }

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
  }),

  /* getNotification
   *
   * @desc Get all notifications for a specific user
   * @endpoint GET /api/notification
   * @access Private
   */
  getNotification: asyncDec(async (req: Request, res: Response) => {
    const { captainId, status: statusStr, type: typeStr } = req.query;

    const status = statusStr as NotificationStatus;
    const type = typeStr as NotificationType;

    const notifications = await prisma.notification.findMany({
      where: {
        captainId: parseInt(captainId as string),
        status: status || NotificationStatus.UNREAD,
        type: type || undefined,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res
      .status(200)
      .json({ message: "Notifications fetched", body: notifications });
  }),

  /* updateNotification
   *
   * @desc Update the status of a notification
   * @endpoint PATCH /api/notification
   * @access Private
   */
  updateNotification: asyncDec(async (req: Request, res: Response) => {
    const { id: idStr, status } = req.body;
    const id = parseInt(idStr);

    if (!status) {
      throw new AppError(400, "Missing required fields", "حقل مطلوب مفقود");
    }

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
  }),

  /* deleteNotification
   *
   * @desc Delete a notification
   * @endpoint DELETE /api/notification
   * @access Private
   */
  deleteNotification: asyncDec(async (req: Request, res: Response) => {
    const { id: idStr } = req.body;
    const id = parseInt(idStr);

    await prisma.notification.delete({
      where: {
        id,
      },
    });

    res.status(200).json({ message: "Notification deleted" });
  }),

  /* bulkUpdateNotifications
   *
   * @desc Update the status of multiple notifications at once
   * @endpoint PATCH /api/notification/bulk-update
   * @access Private
   */
  bulkUpdateNotifications: asyncDec(async (req: AuthenticatedRequest, res: Response) => {
    // Get captain ID from authenticated user object
    const captainId = req.captain?.captainId;
    
    if (!captainId) {
      throw new AppError(401, "Authentication required", "يجب تسجيل الدخول");
    }
    
    // Update all UNREAD notifications to READ for this captain
    const result = await prisma.notification.updateMany({
      where: {
        captainId: captainId,
        status: NotificationStatus.UNREAD
      },
      data: {
        status: NotificationStatus.READ
      }
    });
    
    res.status(200).json({
      message: "Notifications marked as read successfully",
      arabicMessage: "تم تعليم جميع الإشعارات كمقروءة",
      count: result.count
    });
  }),

  /* bulkDeleteNotifications
   *
   * @desc Delete all READ notifications for a captain
   * @endpoint DELETE /api/notification/bulk-delete
   * @access Private
   */
  bulkDeleteNotifications: asyncDec(async (req: AuthenticatedRequest, res: Response) => {
    // Get captain ID from authenticated user object
    const captainId = req.captain?.captainId;
    
    if (!captainId) {
      throw new AppError(401, "Authentication required", "يجب تسجيل الدخول");
    }
    
    // Delete only READ notifications for this captain
    const result = await prisma.notification.deleteMany({
      where: {
        captainId: captainId,
        status: NotificationStatus.READ
      }
    });
    
    res.status(200).json({
      message: "Read notifications deleted successfully",
      arabicMessage: "تم حذف جميع الإشعارات المقروءة",
      count: result.count
    });
  }),
};

export default notificationController;
