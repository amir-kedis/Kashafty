import { Router } from "express";

import authController from "../controllers/auth.controller";
import passport from "passport";

const authRouter = Router();

authRouter.post("/signUp", authController.signup);
authRouter.post("/logIn", authController.login);
authRouter.post(
  "/newPassword",
  passport.authenticate("jwt", { session: false }),
  authController.updatePassword,
);
authRouter.post(
  "/logOut",
  passport.authenticate("jwt", { session: false }),
  authController.logout,
);
authRouter.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  authController.me,
);

export default authRouter;
