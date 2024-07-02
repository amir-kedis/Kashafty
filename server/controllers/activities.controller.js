import db from "../database/db.js";

const activitiesController = {
  insertActivity: async (req, res) => {
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

      res.status(200).json({
        message: "Successful insertion",
        body: result.rows,
        count: result.rowCount,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "An error occured while inserting a new activity",
        body: error,
      });
    }
  },
  getAllActivities: async (_, res) => {
    try {
      const result = await db.query(`
                SELECT *
                FROM "Activity"
            `);

      res.status(200).json({
        message: "Successful retrieval",
        body: result.rows,
        count: result.rowCount,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "An error occured while retrieving activities",
        body: error,
      });
    }
  },
};

export default activitiesController;

