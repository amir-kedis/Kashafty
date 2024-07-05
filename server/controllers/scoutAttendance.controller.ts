import { Request, Response } from "express";
import { prisma } from "../database/db";
import { AttendanceStatus } from "@prisma/client";

// =================================================
// TODO: This module needs reconnecting with frontend
// =================================================

interface UpsertAttendanceRequest extends Request {
  body: {
    attendanceRecords: {
      scoutId: string;
      weekNumber: number;
      termNumber: number;
      attendanceStatus: string;
    }[];
  };
}

interface GetSectorAttendanceRequest extends Request {
  query: {
    baseName: string;
    suffixName: string;
    weekNumber: string;
    termNumber: string;
  };
}

interface GetScoutAttendanceRequest extends Request {
  params: {
    scoutId: string;
    weekNumber: string;
    termNumber: string;
  };
}

const scoutAttendanceController = {
  // @desc    Insert a new attendance record for a scout in a certain sector
  // @route   POST /api/sectorAttendance/
  // @access  Private
  upsertAttendance: async (req: UpsertAttendanceRequest, res: Response) => {
    try {
      const { attendanceRecords } = req.body;

      if (!attendanceRecords || attendanceRecords.length === 0) {
        return res.status(404).json({
          error: "No records were found",
        });
      }

      let result = [];

      for (let i = 0; i < attendanceRecords.length; i++) {
        const attendanceRecord = await prisma.scoutAttendance.upsert({
          where: {
            scoutId_weekNumber_termNumber: {
              scoutId: parseInt(attendanceRecords[i].scoutId),
              weekNumber: attendanceRecords[i].weekNumber,
              termNumber: attendanceRecords[i].termNumber,
            },
          },
          update: {
            attendanceStatus: attendanceRecords[i]
              .attendanceStatus as AttendanceStatus,
          },
          create: {
            scoutId: parseInt(attendanceRecords[i].scoutId),
            weekNumber: attendanceRecords[i].weekNumber,
            termNumber: attendanceRecords[i].termNumber,
            attendanceStatus: attendanceRecords[i]
              .attendanceStatus as AttendanceStatus,
          },
        });
        result.push(attendanceRecord);
      }

      res.status(200).json({
        message: "Successful insertion",
        body: result,
        count: result.length,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "An error occurred while inserting a new attendance",
        body: error,
      });
    }
  },

  // @desc    Get all attendance records for all the scouts in a certain sector in a certain week & term
  // @route   GET /api/sectorAttendance/sector/all
  // @access  Private
  // TODO: needs reconnecting with frontend
  getSectorAttendance: async (
    req: GetSectorAttendanceRequest,
    res: Response,
  ) => {
    try {
      let {
        baseName,
        suffixName,
        weekNumber,
        termNumber,
      }: {
        baseName: string;
        suffixName: string;
        weekNumber: string | number;
        termNumber: string | number;
      } = req.query;
      weekNumber = parseInt(weekNumber);
      termNumber = parseInt(termNumber);

      const scouts = await prisma.scout.findMany({
        where: {
          sectorBaseName: baseName,
          sectorSuffixName: suffixName,
        },
        include: {
          ScoutAttendance: true,
        },
      });

      // Filter ScoutAttendance for the specified weekNumber and termNumber
      const result = scouts.map((scout) => {
        const filteredAttendance = scout.ScoutAttendance.filter(
          (attendance) =>
            attendance.weekNumber === weekNumber &&
            attendance.termNumber === termNumber,
        );
        return {
          ...scout,
          ScoutAttendance:
            filteredAttendance.length > 0 ? filteredAttendance : null,
        };
      });

      console.log(result);

      res.status(200).json({
        message: "Successful retrieval",
        body: result,
        count: result.length,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "An error occurred while retrieving sector attendance",
        body: error,
      });
    }
  },

  // @desc    Get attendance records for a certain scout in a certain week & term
  // @route   GET /api/sectorAttendance/:scoutId/:weekNumber/:termNumber
  // @access  Private
  getScoutAttendance: async (req: GetScoutAttendanceRequest, res: Response) => {
    try {
      let {
        scoutId,
        weekNumber,
        termNumber,
      }: {
        scoutId: string | number;
        weekNumber: string | number;
        termNumber: string | number;
      } = req.params;
      scoutId = parseInt(scoutId);
      weekNumber = parseInt(weekNumber);
      termNumber = parseInt(termNumber);

      const result = await prisma.scoutAttendance.findMany({
        where: {
          scoutId: scoutId,
          weekNumber: weekNumber,
          termNumber: termNumber,
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
        error: "An error occurred while retrieving sector attendance",
        body: error,
      });
    }
  },
};

export default scoutAttendanceController;
