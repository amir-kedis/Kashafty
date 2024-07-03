import { Router } from "express";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
const authRouter = Router();

authRouter.post("/signUp", authController.signup);
authRouter.post("/logIn", authController.login);
authRouter.post("/newPassword", authMiddleware, authController.updatePassword);
authRouter.post("/logOut", authMiddleware, authController.logout);
authRouter.get("/me", authMiddleware, authController.me);

export default authRouter;
