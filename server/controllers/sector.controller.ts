import { Request, Response } from "express";
import db from "../database/db";

interface GetAllSectorsRequest extends Request {
  body: {};
}

interface GetAllSectorsInUnitRequest extends Request {
  params: {
    unitCaptainId: string;
  };
}

interface GetSectorRequest extends Request {
  query: {
    baseName: string;
    suffixName: string;
  };
}

interface InsertSectorRequest extends Request {
  body: {
    baseName: string;
    suffixName?: string;
    unitCaptainId?: string;
  };
}

interface SetUnitCaptainRequest extends Request {
  query: {
    baseName: string;
    suffixName: string;
  };
  body: {
    unitCaptainId: string;
  };
}

interface AssignCaptainRequest extends Request {
  query: {
    baseName: string;
    suffixName: string;
  };
  body: {
    captainId: string;
  };
}

const sectorController = {
  // @desc    Get all sectors (info and count)
  // @route   GET /api/sector/all
  // @access  Private
  getAllSectors: async (_: GetAllSectorsRequest, res: Response) => {
    try {
      const result = await db.query(`
        SELECT *
        FROM "Sector";
      `);

      res.status(200).json({
        message: "Successful retrieval",
        body: result.rows,
        count: result.rowCount,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "An error occurred while retrieving sector info",
        body: error,
      });
    }
  },

  // @desc    Get all sectors in a unit (info and count)
  // @route   GET /api/sector/unit/:unitCaptainId
  // @access  Private
  getAllSectorsInUnit: async (
    req: GetAllSectorsInUnitRequest,
    res: Response,
  ) => {
    try {
      const { unitCaptainId } = req.params;

      const result = await db.query(
        `SELECT *
        FROM "Sector"
        WHERE "unitCaptainId" = $1;`,
        [unitCaptainId],
      );

      res.status(200).json({
        message: "Successful retrieval",
        body: result.rows,
        count: result.rowCount,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "An error occurred while retrieving sectors info",
        body: error,
      });
    }
  },

  // @desc    Get sector by baseName and suffixName
  // @route   GET /api/sector/:baseName/:suffixName
  // @access  Private
  getSector: async (req: GetSectorRequest, res: Response) => {
    try {
      const { baseName, suffixName } = req.query;

      const result = await db.query(
        `
        SELECT *
        FROM "Sector"
        WHERE "baseName" = $1 AND "suffixName" = $2;
      `,
        [baseName, suffixName],
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          error: "No sector found with this name",
        });
      }

      res.status(200).json({
        message: "Successful retrieval",
        body: result.rows,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "An error occurred while retrieving the sector info",
        body: error,
      });
    }
  },

  // @desc    Insert a new sector
  // @route   POST /api/sector/add
  // @access  Private
  insertSector: async (req: InsertSectorRequest, res: Response) => {
    try {
      let { baseName, suffixName, unitCaptainId } = req.body;

      if (!baseName) {
        return res.status(400).json({
          error: "You must insert a baseName for the sector",
        });
      }

      if (!suffixName) {
        suffixName = "";
      }

      const result = await db.query(
        `
        INSERT INTO "Sector" ("baseName", "suffixName", "unitCaptainId")
        VALUES ($1, $2, $3)
        RETURNING *;
      `,
        [baseName, suffixName, unitCaptainId],
      );

      res.status(200).json({
        message: "Successful insertion",
        body: result.rows,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "An error occurred while inserting the sector",
        body: error,
      });
    }
  },

  // @desc    Update a sector's unit captain
  // @route   PATCH /api/sector/unit/set/:baseName/:suffixName
  // @access  Private
  setUnitCaptain: async (req: SetUnitCaptainRequest, res: Response) => {
    try {
      const { baseName, suffixName } = req.query;
      const { unitCaptainId } = req.body;

      if (!unitCaptainId) {
        return res.status(400).json({
          error: "Please provide a valid unit captain id",
        });
      }

      const sectorInfo = await db.query(
        `
        SELECT *
        FROM "Sector"
        WHERE "baseName" = $1 AND "suffixName" = $2;
      `,
        [baseName, suffixName],
      );

      if (sectorInfo.rowCount === 0) {
        return res.status(404).json({
          error: "No sector exists with these ids",
        });
      }

      const captainInfo = await db.query(
        `
        SELECT *
        FROM "Captain"
        WHERE "captainId" = $1;
      `,
        [unitCaptainId],
      );

      if (captainInfo.rowCount === 0) {
        return res.status(404).json({
          error: "No captain exists with this id",
        });
      }

      if (captainInfo.rows[0].type !== "unit") {
        return res.status(400).json({
          error: "The provided captain id is not for a unit captain",
        });
      }

      const result = await db.query(
        `
        UPDATE "Sector"
        SET "unitCaptainId" = $1
        WHERE "baseName" = $2 AND "suffixName" = $3
        RETURNING *;
      `,
        [unitCaptainId, baseName, suffixName],
      );

      res.status(200).json({
        message: "Successful update",
        body: result.rows,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "An error occurred while updating the sector info",
        body: error,
      });
    }
  },

  // @desc    Assign a regular captain to a sector
  // @route   PATCH /api/sector/captain/assign/:baseName/:suffixName
  // @access  Private
  assignCaptain: async (req: AssignCaptainRequest, res: Response) => {
    try {
      const { baseName, suffixName } = req.query;
      const { captainId } = req.body;

      const result = await db.query(
        `
        UPDATE "Captain"
        SET "rSectorBaseName" = $1, "rSectorSuffixName" = $2
        WHERE "captainId" = $3
        RETURNING *;
      `,
        [baseName, suffixName, captainId],
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          error: "Error occurred while assigning captain",
        });
      }

      res.status(200).json({
        message: "Successful assignment",
        body: result.rows,
        count: result.rowCount,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error:
          "An error occurred while assigning a regular captain to a sector",
        body: error,
      });
    }
  },
};

export default sectorController;
