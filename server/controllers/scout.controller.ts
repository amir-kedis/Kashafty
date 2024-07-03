import { Request, Response } from "express";
import db from "../database/db";

interface GetScoutsInSectorRequest extends Request {
  query: {
    baseName: string;
    suffixName: string;
  };
}

interface GetScoutsInUnitRequest extends Request {
  params: {
    unitCaptainId: string;
  };
}

interface UpdateScoutRequest extends Request {
  params: {
    scoutId: string;
  };
  body: {
    firstName: string;
    middleName: string;
    lastName: string;
    gender: string;
    sectorBaseName: string;
    sectorSuffixName: string;
    birthDate: string;
    enrollDate: string;
    schoolGrade: string;
    photo: string;
    birthCertificate: string;
  };
}

interface InsertScoutRequest extends Request {
  body: {
    firstName: string;
    middleName: string;
    lastName: string;
    gender: string;
    sectorBaseName: string;
    sectorSuffixName: string;
    birthDate: string;
    enrollDate: string;
    schoolGrade: string;
    photo: string;
    birthCertificate: string;
  };
}

const scoutController = {
  getAllScouts: async (_: Request, res: Response) => {
    try {
      const result = await db.query(`SELECT * FROM "Scout";`);
      res.status(200).json({
        message: "Successful retrieval",
        body: result.rows,
        count: result.rowCount,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "An error occurred while retrieving data",
        body: error,
      });
    }
  },

  getScoutsInSector: async (req: GetScoutsInSectorRequest, res: Response) => {
    try {
      const { baseName, suffixName } = req.query;

      const result = await db.query(
        `SELECT *
                FROM "Scout"
                WHERE "sectorBaseName" = $1 AND "sectorSuffixName" = $2;`,
        [baseName, suffixName],
      );

      res.status(200).json({
        message: "Successful retrieval",
        body: result.rows,
        count: result.rowCount,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "An error occurred while retrieving data",
        body: error,
      });
    }
  },

  getScoutsInUnit: async (req: GetScoutsInUnitRequest, res: Response) => {
    try {
      const { unitCaptainId } = req.params;

      const result = await db.query(
        `SELECT scout.*
                FROM "Scout" AS scout, "Sector" AS sector
                WHERE sector."unitCaptainId" = $1 AND
                scout."sectorBaseName" = sector."baseName" AND
                scout."sectorSuffixName" = sector."suffixName";`,
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
        message: "An error occurred while retrieving data",
        body: error,
      });
    }
  },

  getScout: async (req: Request, res: Response) => {
    try {
      const { scoutId } = req.params;

      const result = await db.query(
        `SELECT *
                FROM "Scout"
                WHERE "scoutId" = $1;`,
        [scoutId],
      );

      if (!result.rows.length) {
        return res.status(404).json({
          error: "No scout found",
        });
      }

      res.status(200).json({
        message: "Successful retrieval",
        body: result.rows[0],
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "An error occurred while retrieving data",
        body: error,
      });
    }
  },

  updateScout: async (req: UpdateScoutRequest, res: Response) => {
    try {
      const { scoutId } = req.params;
      const {
        firstName,
        middleName,
        lastName,
        gender,
        sectorBaseName,
        sectorSuffixName,
        birthDate,
        enrollDate,
        schoolGrade,
        photo,
        birthCertificate,
      } = req.body;

      const result1 = await db.query(
        `UPDATE "Scout"
                SET "firstName" = $1, "middleName" = $2, "lastName" = $3, "gender" = $4, "sectorBaseName" = $5,
                "sectorSuffixName" = $6
                WHERE "scoutId" = $7
                RETURNING *;`,
        [
          firstName,
          middleName,
          lastName,
          gender,
          sectorBaseName,
          sectorSuffixName,
          scoutId,
        ],
      );

      if (result1.rowCount === 0) {
        return res.status(404).json({
          error: "No rows updated for the scout",
        });
      }

      const result2 = await db.query(
        `UPDATE "ScoutProfile"
                SET "birthDate" = $1, "enrollDate" = $2, "schoolGrade" = $3, "photo" = $4,
                "birthCertificate" = $5
                WHERE "scoutId" = $6
                RETURNING *;`,
        [birthDate, enrollDate, schoolGrade, photo, birthCertificate, scoutId],
      );

      res.status(200).json({
        message: "Successful update",
        body: { scout: result1.rows[0], scoutProfile: result2.rows[0] },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "An error occurred while updating the scout",
        body: error,
      });
    }
  },

  insertScout: async (req: InsertScoutRequest, res: Response) => {
    try {
      const {
        firstName,
        middleName,
        lastName,
        gender,
        sectorBaseName,
        sectorSuffixName,
        birthDate,
        enrollDate,
        schoolGrade,
        photo,
        birthCertificate,
      } = req.body;

      const result1 = await db.query(
        `INSERT INTO "Scout" ("firstName", "middleName", "lastName", "gender", "sectorBaseName", "sectorSuffixName")
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;`,
        [
          firstName,
          middleName,
          lastName,
          gender,
          sectorBaseName,
          sectorSuffixName,
        ],
      );

      if (result1.rowCount === 0) {
        return res.status(400).json({
          error: "No data was inserted for the scout",
        });
      }

      const result2 = await db.query(
        `INSERT INTO "ScoutProfile" ("birthDate", "enrollDate", "schoolGrade", "photo", "birthCertificate", "scoutId")
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;`,
        [
          birthDate,
          enrollDate,
          schoolGrade,
          photo,
          birthCertificate,
          result1.rows[0].scoutId,
        ],
      );

      if (result2.rowCount === 0) {
        return res.status(400).json({
          error: "No data was inserted for the scout profile",
          body: { scout: result1.rows[0] },
        });
      }

      res.status(200).json({
        message: "Successful insertion",
        body: { scout: result1.rows[0], scoutProfile: result2.rows[0] },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "An error occurred while inserting a new scout",
        body: error,
      });
    }
  },
};

export default scoutController;
