import { Request, Response } from "express";
import db from "../database/db";

const activitiesController = {
  insertActivity: async (req: Request, res: Response): Promise<any> => {
    try {
      const { name, place, weekNumber, termNumber, day, type } = req.body;

      const result = await db.query(
        `
          INSERT INTO "Activity" ( "name" , "place", "weekNumber", "termNumber", "day", "type")
          VALUES ($1, $2, $3, $4, $5 , $6)
          RETURNING *
        `,
        [name, place, weekNumber, termNumber, day, type],
      );

      if (result.rowCount === 0) {
        return res.status(400).json({
          error: "Insertion failed",
        });
      }

      return res.status(200).json({
        message: "Successful insertion",
        body: result.rows,
        count: result.rowCount,
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
      const result = await db.query(`
        SELECT *
        FROM "Activity"
      `);

      return res.status(200).json({
        message: "Successful retrieval",
        body: result.rows,
        count: result.rowCount,
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
