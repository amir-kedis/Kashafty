import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../database/db";
import { Gender } from "@prisma/client";
import { hashPassword, validatePassword } from "../utils/password_utils";
import generateAccessJWT from "../utils/generateToken";
import ms from "ms";

interface SignupRequestBody {
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  password: string;
  gender: string;
}

interface LoginRequestBody {
  emailOrMobile: string;
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

      if (email) {
        // Check if the email is taken
        const existingCaptain = await prisma.captain.findUnique({
          where: { email: email.toLowerCase() },
        });

        if (existingCaptain) {
          return res.status(400).json({ error: "Email is taken!!" });
        }
      }

      // Hash the password
      const hashedPassword = await hashPassword(password);

      // Create a new Captain
      const newCaptain = await prisma.captain.create({
        data: {
          firstName,
          middleName,
          lastName,
          phoneNumber,
          email: email ? email.toLowerCase() : null, // Set to null if no email provided
          password: hashedPassword,
          gender: gender === "male" ? Gender.male : Gender.female,
          type: "regular",
        },
      });

      // Generate a JWT token
      const { token, expiresIn } = generateAccessJWT(
        newCaptain.captainId.toString(),
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        domain: process.env.NODE_ENV === "production" ? ".kashafty.app" : "",
        maxAge: ms(expiresIn),
      });

      // Send the response
      res.status(201).json({
        message: "Captain created successfully",
        body: newCaptain,
        token: token,
        expiresIn: expiresIn,
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
      const { emailOrMobile, password } = req.body;

      // Check if the input is an email or a mobile number
      const isEmail = emailOrMobile.includes("@");

      let captain;
      if (isEmail) {
        captain = await prisma.captain.findUnique({
          where: { email: emailOrMobile.toLowerCase() },
        });
      } else {
        captain = await prisma.captain.findUnique({
          where: { phoneNumber: emailOrMobile },
        });
      }

      if (!captain) {
        return res.status(400).json({
          error: "Invalid email or mobile number",
        });
      }

      // Check if the password is correct
      const isCorrect = await validatePassword(password, captain.password);

      if (!isCorrect) {
        return res.status(400).json({
          error: "Invalid password",
        });
      }

      // Generate a JWT token
      const { token, expiresIn } = generateAccessJWT(
        captain.captainId.toString(),
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        domain: process.env.NODE_ENV === "production" ? ".kashafty.app" : "",
        maxAge: ms(expiresIn),
      });

      // Send the response
      res.status(200).json({
        message: "Logged in successfully",
        body: captain,
        token: token,
        expiresIn: expiresIn,
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
