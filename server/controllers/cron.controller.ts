/*==================================================================================================
 *
 *
 *
 *     ██████╗██████╗  ██████╗ ███╗   ██╗
 *    ██╔════╝██╔══██╗██╔═══██╗████╗  ██║
 *    ██║     ██████╔╝██║   ██║██╔██╗ ██║
 *    ██║     ██╔══██╗██║   ██║██║╚██╗██║
 *    ╚██████╗██║  ██║╚██████╔╝██║ ╚████║██╗
 *     ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝
 *
 *
 *    handles all repeated requests.
 *
 *    Author: Amir Kedis
 *
 *==================================================================================================*/

import { Request, Response } from "express";
import { prisma } from "../database/db";

const cronController = {
  createMissingWeeks: async (req: Request, res: Response) => {
    try {
      const curTerm = await prisma.term.findFirst({
        orderBy: {
          termNumber: "desc",
        },
        include: {
          Week: true,
        },
      });

      if (!curTerm) {
        return res.status(404).json({ message: "No current term found" });
      }

      const today = new Date();
      const startDate = new Date(curTerm.startDate);

      const totalWeeks = Math.ceil(
        (today.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000),
      );

      const existingWeeks = new Set(
        curTerm.Week.map((week) => week.weekNumber),
      );

      // Create missing weeks
      for (let i = 1; i <= totalWeeks; i++) {
        if (!existingWeeks.has(i)) {
          await prisma.week.create({
            data: {
              weekNumber: i,
              termNumber: curTerm.termNumber,
              startDate: new Date(
                startDate.getTime() + (i - 1) * 7 * 24 * 60 * 60 * 1000,
              ),
            },
          });
        }
      }

      res.status(200).json({ message: "Missing weeks created successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default cronController;
