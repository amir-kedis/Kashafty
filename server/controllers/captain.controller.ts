import { Request, Response } from "express";
import db from "../database/db";

interface GetAllCaptainsRequest extends Request {
  query: {
    type?: string;
  };
}

interface GetCaptainsInSectorRequest extends Request {
  query: {
    baseName: string;
    suffixName: string;
  };
}

interface GetCaptainsInUnitRequest extends Request {
  params: {
    unitCaptainId: string;
  };
}

interface GetCaptainRequest extends Request {
  params: {
    captainId: string;
  };
}

const captainController = {
  getAllCaptains: async (
    req: GetAllCaptainsRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const { type } = req.query;

      let result;
      if (type === "regular") {
        result = await db.query(
          `SELECT * FROM "Captain" WHERE "type" = 'regular'`,
        );
      } else if (type === "unit") {
        result = await db.query(
          `SELECT * FROM "Captain" WHERE "type" = 'unit'`,
        );
      } else if (type === "general") {
        result = await db.query(
          `SELECT * FROM "Captain" WHERE "type" = 'general'`,
        );
      } else {
        result = await db.query(`SELECT * FROM "Captain"`);
      }

      res.status(200).json({
        message: "Successful retrieval",
        body: result.rows,
        count: result.rowCount,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "An error occurred while retrieving the captains info",
        body: error,
      });
    }
  },

  getCaptainsInSector: async (
    req: GetCaptainsInSectorRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const { baseName, suffixName } = req.query;

      const result = await db.query(
        `SELECT *
         FROM "Captain"
         WHERE "rSectorBaseName" = $1 AND "rSectorSuffixName" = $2`,
        [baseName, suffixName],
      );

      res.status(200).json({
        message: "Successful retrieval",
        body: result.rows,
        count: result.rowCount,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while retrieving data",
        body: error,
      });
    }
  },

  getCaptainsInUnit: async (
    req: GetCaptainsInUnitRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const { unitCaptainId } = req.params;

      const result = await db.query(
        `SELECT C.*
         FROM "Captain" AS C, "Sector" AS S
         WHERE S."unitCaptainId" = $1 AND
               C."rSectorBaseName" = S."baseName" AND
               C."rSectorSuffixName" = S."suffixName";`,
        [unitCaptainId],
      );

      res.status(200).json({
        message: "Successful retrieval",
        body: result.rows,
        count: result.rowCount,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while retrieving data",
        body: error,
      });
    }
  },

  getCaptain: async (req: GetCaptainRequest, res: Response): Promise<any> => {
    try {
      const { captainId } = req.params;

      const result = await db.query(
        `SELECT *
         FROM "Captain"
         WHERE "captainId" = $1`,
        [captainId],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "Captain not found!",
        });
      }

      res.status(200).json({
        message: "Successful retrieval",
        body: result.rows[0],
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while retrieving data",
        body: error,
      });
    }
  },

  // @desc    Update a captain type
  // @route   PATCH /api/captain/change/type/:id
  // @access  Private
  setCaptainType: async (req: Request, res: Response): Promise<any> => {
    try {
      const { captainId } = req.params;
      const { type } = req.body;

      if (!captainId) {
        return res.status(400).json({
          error: "Please enter a valid id",
        });
      }

      if (type !== "regular" && type !== "unit" && type !== "general") {
        return res.status(400).json({
          error: "Please enter a valid captain type",
        });
      }

      const result = await db.query(
        `UPDATE "Captain"
         SET "type" = $2
         WHERE "captainId" = $1
         RETURNING *;`,
        [captainId, type],
      );

      res.status(200).json({
        message: "Successful update",
        body: result.rows,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while updating data",
        body: error,
      });
    }
  },
};

export default captainController;
