import { Request, Response } from "express";
import { prisma } from "../database/db";
import AppError from "../utils/AppError";
import asyncDec from "../utils/asyncDec";



async function insertActivity(req: Request, res: Response){

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
    throw new AppError(400, "Insertion failed", "فشلت عملية الإدخال");
  }

  return res.status(200).json({
    message: "Successful insertion",
    body: activity,
  });

}

async function getAllActivities(req: Request, res: Response) {

  const activities = await prisma.activity.findMany();

  return res.status(200).json({
    message: "Successful retrieval",
    body: activities,
    count: activities.length,
  });
}

const activitiesController = {
  insertActivity: asyncDec(insertActivity),
  getAllActivities: asyncDec(getAllActivities)
};

export default activitiesController;
