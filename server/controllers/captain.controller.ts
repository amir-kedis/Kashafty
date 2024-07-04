import { Request, Response } from "express";
import { prisma } from "../database/db";
import { Captain } from "@prisma/client";

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

      let result: Captain[] = await prisma.captain.findMany();

      if (type) {
        result = result.filter((captain) => captain.type === type);
      }

      res.status(200).json({
        message: "Successful retrieval",
        body: result,
        count: result.length,
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

      const result = await prisma.captain.findMany({
        where: {
          rSectorBaseName: baseName,
          rSectorSuffixName: suffixName,
        },
      });

      res.status(200).json({
        message: "Successful retrieval",
        body: result,
        count: result.length,
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

      // NOTE: left as a ref remove after the testing the below todo
      // const result = await db.query(
      //   `SELECT C.*
      //    FROM "Captain" AS C, "Sector" AS S
      //    WHERE S."unitCaptainId" = $1 AND
      //          C."rSectorBaseName" = S."baseName" AND
      //          C."rSectorSuffixName" = S."suffixName";`,
      //   [unitCaptainId],
      // );

      // TODO: this needs testing
      console.log(unitCaptainId);
      const result = await prisma.captain.findMany({
        where: {
          Sector_Sector_unitCaptainIdToCaptain: {
            some: {
              unitCaptainId: parseInt(unitCaptainId),
            },
          },
        },
        include: {
          Sector_Sector_unitCaptainIdToCaptain: true,
        },
      });

      res.status(200).json({
        message: "Successful retrieval",
        body: result,
        count: result.length,
      });

      console.log(result);
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

      const result = await prisma.captain.findUnique({
        where: {
          captainId: parseInt(captainId),
        },
      });

      if (!result) {
        return res.status(404).json({
          error: "Captain not found!",
        });
      }

      res.status(200).json({
        message: "Successful retrieval",
        body: result,
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

      const result = await prisma.captain.update({
        where: {
          captainId: parseInt(captainId),
        },
        data: {
          type,
        },
      });

      res.status(200).json({
        message: "Successful update",
        body: result,
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
