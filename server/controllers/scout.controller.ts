import { Request, Response } from "express";
import { prisma } from "../database/db";
import { Gender } from "@prisma/client";

// =================================================
// TODO: This module needs testing
// =================================================

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
      const scouts = await prisma.scout.findMany();

      res.status(200).json({
        message: "Successful retrieval",
        body: scouts,
        count: scouts.length,
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

      const result = await prisma.scout.findMany({
        where: {
          sectorBaseName: baseName,
          sectorSuffixName: suffixName,
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
        message: "An error occurred while retrieving data",
        body: error,
      });
    }
  },

  getScoutsInUnit: async (req: GetScoutsInUnitRequest, res: Response) => {
    try {
      const { unitCaptainId } = req.params;

      // const result = await db.query(
      //   `SELECT scout.*
      //           FROM "Scout" AS scout, "Sector" AS sector
      //           WHERE sector."unitCaptainId" = $1 AND
      //           scout."sectorBaseName" = sector."baseName" AND
      //           scout."sectorSuffixName" = sector."suffixName";`,
      //   [unitCaptainId],
      // );

      const result = await prisma.scout.findMany({
        where: {
          Sector: {
            unitCaptainId: parseInt(unitCaptainId),
          },
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
        message: "An error occurred while retrieving data",
        body: error,
      });
    }
  },

  getScout: async (req: Request, res: Response) => {
    try {
      const { scoutId } = req.params;

      const result = await prisma.scout.findUnique({
        where: {
          scoutId: parseInt(scoutId),
        },
        include: {
          ScoutProfile: true,
        },
      });

      if (!result) {
        return res.status(404).json({
          error: "No scout found",
        });
      }

      res.status(200).json({
        message: "Successful retrieval",
        body: result,
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

      const scout = await prisma.scout.update({
        where: {
          scoutId: parseInt(scoutId),
        },
        data: {
          firstName,
          middleName,
          lastName,
          gender: gender == "male" ? Gender.male : Gender.female,
          sectorBaseName,
          sectorSuffixName,
          ScoutProfile: {
            update: {
              birthDate: new Date(birthDate),
              enrollDate: new Date(enrollDate),
              schoolGrade: parseInt(schoolGrade),
              photo,
              birthCertificate,
            },
          },
        },
      });

      res.status(200).json({
        message: "Successful update",
        body: scout,
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

      const scout = await prisma.scout.create({
        data: {
          firstName,
          middleName,
          lastName,
          gender: gender == "male" ? Gender.male : Gender.female,
          sectorBaseName,
          sectorSuffixName,
          ScoutProfile: {
            create: {
              birthDate: new Date(birthDate),
              enrollDate: new Date(enrollDate),
              schoolGrade: parseInt(schoolGrade),
              photo,
              birthCertificate,
            },
          },
        },
      });
      console.log(scout);

      res.status(200).json({
        message: "Successful insertion",
        body: scout,
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
