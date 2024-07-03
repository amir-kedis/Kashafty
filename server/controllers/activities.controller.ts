import { Request, Response } from "express";
import { prisma } from "../database/db";

const activitiesController = {
  insertActivity: async (req: Request, res: Response): Promise<any> => {
    try {
      const { name, place, weekNumber, termNumber, day, type } = req.body;

      const activity = await prisma.activity.create({
        data: {
          name,
          place,
          weekNumber: parseInt(weekNumber),
          termNumber: parseInt(termNumber),
          day,
          type,
        },
      });

      if (!activity) {
        return res.status(400).json({
          error: "Insertion failed",
        });
      }

      return res.status(200).json({
        message: "Successful insertion",
        body: activity,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "An error occurred while inserting a new activity",
        body: error,
      });
    }
  },

  getAllActivities: async (_: Request, res: Response): Promise<any> => {
    try {
      const activities = await prisma.activity.findMany();

      return res.status(200).json({
        message: "Successful retrieval",
        body: activities,
        count: activities.length,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "An error occurred while retrieving activities",
        body: error,
      });
    }
  },
};

export default activitiesController;
