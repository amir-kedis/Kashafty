import { Router } from "express";
import termController from "../controllers/term.controller";
import checkRankMiddleware from "../middlewares/checkRank.middleware";
import {
  getCurrentTermMiddleware,
  getCurrentWeekMiddleware,
} from "../middlewares/current.middleware";

const termRouter = Router();

// Term routes
termRouter.get("/", getCurrentTermMiddleware, termController.getTerm);
termRouter.post(
  "/",
  checkRankMiddleware("general"),
  getCurrentTermMiddleware,
  termController.addTerm,
);
termRouter.patch(
  "/",
  checkRankMiddleware("general"),
  termController.updateTerm,
);

// Week routes
termRouter.get(
  "/week/all",
  getCurrentTermMiddleware,
  termController.getAllWeeks,
);
termRouter.get(
  "/week",
  getCurrentWeekMiddleware,
  termController.getCurrentWeek,
);
termRouter.patch(
  "/week",
  checkRankMiddleware("general"),
  getCurrentWeekMiddleware,
  termController.cancelWeek,
);

// Other routes
termRouter.get(
  "/remaining",
  getCurrentTermMiddleware,
  termController.getRemainingWeeks,
);

export default termRouter;
