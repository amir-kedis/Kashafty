import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import db from "../database/db";
import generateToken from "../utils/generateToken";

interface SignupRequestBody {
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  gender: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

const authController = {
  // @desc    Create a new captain
  // @route   POST /api/auth/signup
  // @access  Public
  signup: async (
    req: Request<any, any, SignupRequestBody>,
    res: Response,
  ): Promise<any> => {
    try {
      const {
        firstName,
        middleName,
        lastName,
        phoneNumber,
        email,
        password,
        gender,
      } = req.body;

      // Check if email already exists
      const captain = await db.query(
        `SELECT "email", "password"
         FROM "Captain" 
         WHERE "email" = $1;`,
        [email.toLowerCase()],
      );
      if (captain.rows.length) {
        return res.status(400).json({ error: "Email is taken!!" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new Captain
      const result = await db.query(
        `INSERT INTO "Captain"("firstName", "middleName", "lastName", "phoneNumber", "email", "password", "gender", "type")
         VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`,
        [
          firstName,
          middleName,
          lastName,
          phoneNumber,
          email.toLowerCase(),
          hashedPassword,
          gender,
          "regular",
        ],
      );
      const newCaptain = result.rows[0];

      // Generate a JWT token
      generateToken(res, newCaptain.captainId);

      // Send the response
      res.status(201).json({
        message: "Captain created successfully",
        body: newCaptain,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "An error occurred while creating a new captain!!",
      });
    }
  },

  // @desc    Login a captain
  // @route   POST /api/auth/login
  // @access  Public
  login: async (
    req: Request<any, any, LoginRequestBody>,
    res: Response,
  ): Promise<any> => {
    try {
      const { email, password } = req.body;

      // Check if email already exists
      const result = await db.query(
        `SELECT *
         FROM "Captain" 
         WHERE "email" = $1;`,
        [email.toLowerCase()],
      );
      if (!result.rows.length) {
        return res.status(400).json({
          error: "Invalid email",
        });
      }

      // Get Captain's data
      const captain = result.rows[0];

      // Check if the password is correct
      const isCorrect = await bcrypt.compare(password, captain.password);
      if (!isCorrect) {
        return res.status(400).json({
          error: "Invalid password",
        });
      }

      // Generate a JWT token
      generateToken(res, captain.captainId);

      // Send the response
      res.status(200).json({
        message: "Logged in successfully",
        body: captain,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "An error occurred while logging you in",
      });
    }
  },

  // @desc    Update a password
  // @route   PATCH /api/auth/newPassword
  // @access  Private
  updatePassword: async (
    req: Request<any, any, { oldPassword: string; newPassword: string }>,
    res: Response,
  ): Promise<any> => {
    try {
      const { oldPassword, newPassword } = req.body;

      // Check if the old password is correct
      const isCorrect = await bcrypt.compare(
        oldPassword,
        req.captain?.password,
      );
      if (!isCorrect) {
        return res.status(400).json({
          error: "Old password is Invalid",
        });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the password
      const result = await db.query(
        `UPDATE "Captain"
         SET "password" = $1
         WHERE "captainId" = $2
         RETURNING *;`,
        [hashedPassword, req.captain?.captainId],
      );

      // Send the response
      res.status(200).json({
        message: "Password updated successfully",
        body: result.rows[0],
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "An error occurred while updating the password",
      });
    }
  },

  // @desc    Logout a captain
  // @route   POST /api/auth/logout
  // @access  Private
  logout: async (_req: Request, res: Response): Promise<any> => {
    try {
      // Clear the cookie
      res.clearCookie("token");

      // Send the response
      res.status(200).json({
        message: "Logged out successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "An error occurred while logging out",
      });
    }
  },

  // @desc    Auth logged-in captain
  // @route   GET /api/auth/me
  // @access  Private
  me: (req: Request, res: Response): void => {
    try {
      res.status(200).json({ message: "You are in", body: req.captain });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "An error occurred while fetching data.",
      });
    }
  },
};

export default authController;
