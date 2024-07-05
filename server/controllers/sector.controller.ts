import { Request, Response } from "express";
import { prisma } from "../database/db";

// =================================================
// TODO: This module needs testing
// - integratoin testing with fronted
// =================================================

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
      const result = await prisma.sector.findMany();

      res.status(200).json({
        message: "Successful retrieval",
        body: result,
        count: result.length,
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
      const { unitCaptainId: unitCaptainIdString } = req.params;
      const unitCaptainId = parseInt(unitCaptainIdString);

      const result = await prisma.sector.findMany({
        where: {
          unitCaptainId,
        },
      });

      res.status(200).json({
        message: "Successful retrieval",
        body: result,
        count: result.length,
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

      const result = await prisma.sector.findUnique({
        where: {
          baseName_suffixName: {
            baseName,
            suffixName,
          },
        },
      });

      res.status(200).json({
        message: "Successful retrieval",
        body: result,
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
      let { baseName, suffixName, unitCaptainId: unitCaptainIdStr } = req.body;
      const unitCaptainId = unitCaptainIdStr
        ? parseInt(unitCaptainIdStr)
        : null;

      if (!baseName) {
        return res.status(400).json({
          error: "You must insert a baseName for the sector",
        });
      }

      if (!suffixName) {
        suffixName = "";
      }

      const result = await prisma.sector.create({
        data: {
          baseName,
          suffixName,
          unitCaptainId,
        },
      });

      res.status(200).json({
        message: "Successful insertion",
        body: result,
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
      const { unitCaptainId: unitCaptainIdStr } = req.body;
      const unitCaptainId = parseInt(unitCaptainIdStr);

      if (!unitCaptainId) {
        return res.status(400).json({
          error: "Please provide a valid unit captain id",
        });
      }

      const sector = await prisma.sector.findUnique({
        where: {
          baseName_suffixName: {
            baseName,
            suffixName,
          },
        },
      });

      if (!sector) {
        return res.status(404).json({
          error: "No sector exists with these ids",
        });
      }

      const captain = await prisma.captain.findUnique({
        where: {
          captainId: unitCaptainId,
        },
      });

      if (!captain) {
        return res.status(404).json({
          error: "No captain exists with this id",
        });
      }

      if (captain?.type !== "unit") {
        return res.status(400).json({
          error: "The provided captain id is not for a unit captain",
        });
      }

      const result = await prisma.sector.update({
        where: {
          baseName_suffixName: {
            baseName,
            suffixName,
          },
        },
        data: {
          unitCaptainId,
        },
      });

      res.status(200).json({
        message: "Successful update",
        body: result,
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
      const { captainId: captainIdStr } = req.body;
      const captainId = parseInt(captainIdStr);

      const result = await prisma.captain.update({
        where: {
          captainId,
        },
        data: {
          rSectorBaseName: baseName,
          rSectorSuffixName: suffixName,
        },
      });

      res.status(200).json({
        message: "Successful assignment",
        body: result,
        count: 1,
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
