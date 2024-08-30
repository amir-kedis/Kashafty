import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../database/db";
import generateToken from "../utils/generateToken";
import { Gender } from "@prisma/client";
import AppError from "../utils/AppError";
import asyncDec from "../utils/asyncDec";

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

// @desc    Create a new captain
// @route   POST /api/auth/signup
// @access  Public

async function signup(req: Request<any, any, SignupRequestBody>, res: Response) {

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
      throw new AppError(400, "Email is already taken", "الإيميل مستخدم بالفعل");
    }

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
      email: email ? email.toLowerCase() : null, // Set to null if no email provided
      password: hashedPassword,
      gender: gender === "male" ? Gender.male : Gender.female,
      type: "regular",
    },
  });

  // Generate a JWT token
  const token = generateToken(res, newCaptain.captainId.toString());

  // Send the response
  res.status(201).json({
    message: "Captain created successfully",
    body: newCaptain,
    token: token,
  });
}

// @desc    Login a captain
// @route   POST /api/auth/login
// @access  Public

async function login(req: Request<any, any, LoginRequestBody>, res: Response) {
 
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
    throw new AppError(400, "Invalid email or mobile number", "الإيميل أو رقم الهاتف غير صحيح");
  }

  // Check if the password is correct
  const isCorrect = await bcrypt.compare(password, captain.password);

  if (!isCorrect) {
    throw new AppError(400, "Invalid password", "كلمة المرور غير صحيحة");
  }

  // Generate a JWT token
  const token = generateToken(res, captain.captainId.toString());

  // Send the response
  res.status(200).json({
    message: "Logged in successfully",
    body: captain,
    token: token,
  });
}

// @desc    Update a password
// @route   PATCH /api/auth/newPassword
// @access  Private

async function updatePassword(req: Request<any, any, { oldPassword: string; newPassword: string }>, res: Response) {
  const { oldPassword, newPassword } = req.body;

  // Check if the old password is correct
  const isCorrect = await bcrypt.compare(
    oldPassword,
    req.captain?.password as string,
  );

  if (!isCorrect) {
    throw new AppError(400, "Old password is Invalid", "كلمة المرور القديمة غير صحيحة");
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
}


// @desc    Logout a captain
// @route   POST /api/auth/logout
// @access  Private

async function logout(req: Request, res: Response) {
  // Clear the token cookie
  res.clearCookie("token");

  // Send the response
  res.status(200).json({
    message: "Logged out successfully",
  });
}

// @desc    Auth logged-in captain
// @route   GET /api/auth/me
// @access  Private

async function me(req: Request, res: Response) {
  res.status(200).json({ message: "You are in", body: req.captain });
}


const authController = {
  signup: asyncDec(signup),
  login: asyncDec(login),  
  updatePassword: asyncDec(updatePassword),  
  logout: asyncDec(logout),  
  me: asyncDec(me),
};

export default authController;
