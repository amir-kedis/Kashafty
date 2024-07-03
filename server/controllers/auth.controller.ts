import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../database/db";
import generateToken from "../utils/generateToken";
import { Gender } from "@prisma/client";

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

      const captain = await prisma.captain.findUnique({
        where: { email: email.toLowerCase() },
      });
      if (captain) {
        return res.status(400).json({ error: "Email is taken!!" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new Captain
      const newCaptain = await prisma.captain.create({
        data: {
          firstName,
          middleName,
          lastName,
          phoneNumber,
          email: email.toLowerCase(),
          password: hashedPassword,
          gender: gender == "male" ? Gender.male : Gender.female,
          type: "regular",
        },
      });

      // Generate a JWT token
      generateToken(res, newCaptain.captainId.toString());

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

      const captain = await prisma.captain.findUnique({
        where: { email: email.toLowerCase() },
      });
      if (!captain) {
        return res.status(400).json({
          error: "Invalid email",
        });
      }

      // Check if the password is correct
      const isCorrect = await bcrypt.compare(password, captain.password);
      if (!isCorrect) {
        return res.status(400).json({
          error: "Invalid password",
        });
      }

      // Generate a JWT token
      generateToken(res, captain.captainId.toString());

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
      const result = await prisma.captain.update({
        where: { captainId: req.captain?.captainId },
        data: { password: hashedPassword },
      });

      // Send the response
      res.status(200).json({
        message: "Password updated successfully",
        body: result,
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
