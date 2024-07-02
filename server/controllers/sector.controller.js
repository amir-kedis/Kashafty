import db from "../database/db.js";

const sectorController = {
  // @desc    Get all sectors (info and count)
  // @route   GET /api/sector/all
  // @access  Private
  getAllSectors: async (_, res) => {
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
        error: "An error occured while retrieving sector info",
        body: error,
      });
    }
  },

  getAllSectorsInUnit: async (req, res) => {
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
        error: "An error occured while retrieving sectors info",
        body: error,
      });
    }
  },

  // @desc    Get sector by id (baseName and suffixName send as params)
  // @route   GET /api/sector/:baseName/:suffixName
  // @access  Private
  getSector: async (req, res) => {
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
        error: "An error occured while retrieving the captains info",
        body: error,
      });
    }
  },
  // @desc    Insert a new sector given its baseName, suffixName and unitCaptainId(optional)
  // @route   POST /api/sector/add
  // @access  Private
  insertSector: async (req, res) => {
    try {
      let { baseName, suffixName, unitCaptainId } = req.body;

      if (!baseName) {
        return res.status(404).json({
          error: "You must insert a baseName for the sector",
        });
      }

      if (!suffixName) {
        suffixName = "";
      }

      const result = await db.query(
        `
                INSERT INTO "Sector" VALUES ($1, $2, $3)
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
        error: "An error occured while retrieving the captains info",
        body: error,
      });
    }
  },

  // @desc    update a sector unit captain
  // @route   PATCH /api/sector/unit/set/:id/:baseName/:suffixName
  // @access  Private
  setUnitCaptain: async (req, res) => {
    try {
      const { baseName, suffixName } = req.query;
      const { unitCaptainId } = req.body;

      if (!unitCaptainId) {
        return res.status(400).json({
          error: "Please enter valid ids",
        });
      }

      const sectorInfo = await db.query(
        `
                SELECT *
                FROM "Sector"
                WHERE "baseName" = $1 AND "suffixName" = $2            
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
                WHERE "captainId" = $1    
            `,
        [unitCaptainId],
      );

      if (captainInfo.rowCount === 0) {
        return res.status(404).json({
          error: "No captain exist with this id",
        });
      }

      if (captainInfo.rows[0].type !== "unit") {
        return res.status(401).json({
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
        error: "An error occured while updating the sector info",
        body: error,
      });
    }
  },
  assignCaptain: async (req, res) => {
    try {
      const { baseName, suffixName } = req.query;
      const { captainId } = req.body;

      const result = await db.query(
        `
                UPDATE "Captain"
                SET "rSectorBaseName" = $1, "rSectorSuffixName" = $2
                WHERE "captainId" = $3
                RETURNING *
            `,
        [baseName, suffixName, captainId],
      );

      if (result.rowCount === 0) {
        return res.status(400).json({
          error: "Error occured while assigning captain",
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
        error: "An error occured while assigning a regular captain to a sector",
        body: error,
      });
    }
  },
};

export default sectorController;
