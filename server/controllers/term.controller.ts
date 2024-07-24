import { Response } from "express";
import { prisma } from "../database/db";

// ==============================================
// TODO: needs integration testing
// ==============================================

const termController = {
  // @desc    Get a term
  // @route   GET /api/term/
  // @access  Private
  getTerm: async (req: any, res: Response) => {
    if (req.currentTerm.termNumber === 0) {
      return res.status(400).json({
        error: "There is no terms in the system",
      });
    }
    res.status(200).json({
      message: "Current term found successfully",
      body: req.currentTerm,
    });
  },

  // @desc    Add a term
  // @route   POST /api/term/
  // @access  Private
  addTerm: async (req: any, res: Response) => {
    try {
      const { termName, startDate, endDate } = req.body;

      const currentDate = new Date();
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      if (startDateObj >= endDateObj || endDateObj < currentDate) {
        return res.status(400).json({
          error: "Invalid dates",
        });
      }
      if (
        req.currentTerm.termNumber &&
        req.currentTerm.endDate &&
        req.currentTerm.endDate >= startDateObj
      ) {
        return res.status(400).json({
          error: "Invalid start date: Overlapping terms",
        });
      }

      const termNumber = req.currentTerm.termNumber + 1;

      const newTerm = await prisma.term.create({
        data: {
          termNumber,
          termName,
          startDate,
          endDate,
        },
      });

      res.status(201).json({
        message: "Term added successfully",
        body: newTerm,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "An error occurred while adding the term",
      });
    }
  },

  // @desc    Update a term
  // @route   PATCH /api/term/
  // @access  Private
  updateTerm: async (req: any, res: Response) => {
    try {
      const { termName, startDate, endDate } = req.body;

      const currentDate = new Date();
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);

      if (startDateObj >= endDateObj) {
        return res.status(400).json({
          error: "Invalid dates",
        });
      }

      let prevTerm = await prisma.term.findMany({
        orderBy: {
          termNumber: "desc",
        },
        take: 1,
        skip: 1,
      });

      if (!prevTerm.length) {
        req.previousTerm = {
          termNumber: 0,
        };
      } else req.previousTerm = prevTerm[0];

      if (
        req?.previousTerm?.termNumber &&
        req?.previousTerm?.endDate &&
        req?.previousTerm?.endDate >= startDateObj
      ) {
        return res.status(400).json({
          error: "Invalid start date: Overlapping terms",
        });
      }

      const updatedTerm = await prisma.term.update({
        where: {
          termNumber: req.currentTerm.termNumber,
        },
        data: {
          termName,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        },
      });

      res.status(200).json({
        message: "Term updated successfully",
        body: updatedTerm,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "An error occurred while updating the term",
      });
    }
  },

  // @desc    Get a week
  // @route   GET /api/term/week
  // @access  Private
  getCurrentWeek: async (req: any, res: Response) => {
    try {
      if (req.currentWeek.weekNumber === 0) {
        return res.status(400).json({
          error: "There is no weeks or terms in the system",
        });
      }
      res.status(200).json({
        message: "Current week found successfully",
        body: req.currentWeek,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "An error occurred while getting the week",
      });
    }
  },

  // @desc    Get all weeks in term
  // @route   GET /api/term/week/all
  // @access  Private
  getAllWeeks: async (req: any, res: Response) => {
    try {
      const weeks = await prisma.week.findMany({
        where: {
          termNumber: req.currentTerm.termNumber,
        },
      });

      res.status(200).json({
        message: "all weeks in current term found successfully",
        body: weeks,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "An error occurred while getting all weeks",
      });
    }
  },

  // @desc    Cancel a week
  // @route   PATCH /api/term/week
  // @access  Private
  cancelWeek: async (req: any, res: Response) => {
    try {
      if (req.currentWeek.weekNumber === 0) {
        return res.status(400).json({
          error: "There is no weeks or terms in the system to be cancelled",
        });
      }

      const termNumber = parseInt(req.currentWeek.termNumber);
      const weekNumber = parseInt(req.currentWeek.weekNumber);

      // TODO: needs testing
      const updatedWeek = await prisma.week.update({
        where: {
          weekNumber_termNumber: {
            termNumber,
            weekNumber,
          },
        },
        data: {
          cancelled: true,
        },
      });

      res.status(200).json({
        message: "Week cancelled successfully",
        body: updatedWeek,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "An error occurred while cancelling the week",
      });
    }
  },

  // @desc    Get remaining weeks
  // @route   GET /api/term/remaining
  // @access  Private
  getRemainingWeeks: async (req: any, res: Response) => {
    try {
      const currentDate = new Date();
      if (
        req.currentTerm.termNumber === 0 ||
        (req.currentTerm.endDate && req.currentTerm.endDate < currentDate)
      ) {
        return res.status(400).json({
          error: "There is no running term in the system",
        });
      }

      const remainingWeeks = Math.ceil(
        (req.currentTerm.endDate.getTime() - currentDate.getTime()) /
          (1000 * 60 * 60 * 24 * 7),
      );

      res.status(200).json({
        message: "Remaining weeks found successfully",
        body: remainingWeeks,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "An error occurred while getting the remaining weeks",
      });
    }
  },
};

export default termController;
