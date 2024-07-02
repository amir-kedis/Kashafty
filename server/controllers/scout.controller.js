import db from "../database/db.js";

const scoutController = {
  getAllScouts: async (_, res) => {
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
        message: "An error occured while retrieving data",
        body: error,
      });
    }
  },
  getScoutsInSector: async (req, res) => {
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
        message: "An error occured while retrieving data",
        body: error,
      });
    }
  },
  getScoutsInUnit: async (req, res) => {
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
        message: "An error occured while retrieving data",
        body: error,
      });
    }
  },
  getScout: async (req, res) => {
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
        message: "An error occured while retrieving data",
        body: error,
      });
    }
  },
  updateScout: async (req, res) => {
    try {
      // Destructuring the req.body to get the required info to update a scout
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

      // Update the scout data
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

      // If no rows are effected respond with an error status and message
      if (result1.rowCount == 0) {
        return res.status(404).json({
          error: "No rows updated for the scout",
        });
      }

      // Update the scout profile data
      const result2 = await db.query(
        `UPDATE "ScoutProfile"
                SET "birthDate" = $1, "enrollDate" = $2, "schoolGrade" = $3, "photo" = $4,
                "birthCertificate" = $5
                WHERE "scoutId" = $6
                RETURNING *;`,
        [birthDate, enrollDate, schoolGrade, photo, birthCertificate, scoutId],
      );

      // Respond with the updated data
      res.status(200).json({
        message: "Successful update",
        body: { scout: result1.rows[0], scoutProfile: result2.rows[0] },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "An error occured while updating the scout",
        body: error,
      });
    }
  },
  insertScout: async (req, res) => {
    try {
      // Destructuring the req.body to get the required info to update a scout
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

      // Insert a new scout into the database
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

      // If nothing was inserted return an error
      if (result1.rowCount == 0) {
        return res.status(400).json({
          error: "No data was inserted for the scout",
        });
      }

      // Insert the scout profile
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

      // If nothing was inserted return an error
      if (result2.rowCount == 0) {
        return res.status(400).json({
          error: "No data was inserted for the scout profile",
          body: { scout: result1.rows[0] },
        });
      }

      // Return the data
      res.status(200).json({
        message: "Successful insertion",
        body: { scout: result1.rows[0], scoutProfile: result2.rows[0] },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "An error occured while inserting a new scout",
        body: error,
      });
    }
  },
};

export default scoutController;
