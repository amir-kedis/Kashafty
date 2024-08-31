import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../database/db";
import { Gender } from "@prisma/client";
import { hashPassword, validatePassword } from "../utils/password_utils";
import generateAccessJWT from "../utils/generateToken";
import ms from "ms";
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


async function signup(req: Request<any, any, SignupRequestBody>, res: Response) {
  const { firstName, middleName, lastName, phoneNumber, email, password, gender } = req.body;

  if (email) {
    const existingCaptain = await prisma.captain.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingCaptain) {
      throw new AppError(400, "Email is taken!!", "البريد الإلكتروني مستخدم بالفعل");
    }
  }

  const hashedPassword = await hashPassword(password);

  const newCaptain = await prisma.captain.create({
    data: {
      firstName,
      middleName,
      lastName,
      phoneNumber,
      email: email ? email.toLowerCase() : null,
      password: hashedPassword,
      gender: gender === "male" ? Gender.male : Gender.female,
      type: "regular",
    },
  });

  const { token, expiresIn } = generateAccessJWT(newCaptain.captainId.toString());

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    domain: process.env.NODE_ENV === "production" ? ".kashafty.app" : "",
    maxAge: ms(expiresIn),
  });

  return res.status(201).json({
    message: "Captain created successfully",
    body: newCaptain,
    token: token,
    expiresIn: expiresIn,
  });
}

async function login(req: Request<any, any, LoginRequestBody>, res: Response) {
  const { emailOrMobile, password } = req.body;

  const isEmail = emailOrMobile.includes("@");
  const captain = await prisma.captain.findUnique({
    where: isEmail ? { email: emailOrMobile.toLowerCase() } : { phoneNumber: emailOrMobile },
  });

  if (!captain) {
    throw new AppError(400, "Invalid email or mobile number", "البريد الإلكتروني أو رقم الجوال غير صحيح");
  }

  const isCorrect = await validatePassword(password, captain.password);

  if (!isCorrect) {
    throw new AppError(400, "Invalid password", "كلمة المرور غير صحيحة");
  }

  const { token, expiresIn } = generateAccessJWT(captain.captainId.toString());

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    domain: process.env.NODE_ENV === "production" ? ".kashafty.app" : "",
    maxAge: ms(expiresIn),
  });

  return res.status(200).json({
    message: "Logged in successfully",
    body: captain,
    token: token,
    expiresIn: expiresIn,
  });
}

async function updatePassword(req: Request<any, any, { oldPassword: string; newPassword: string }>, res: Response) {
  const { oldPassword, newPassword } = req.body;

  const isCorrect = await bcrypt.compare(oldPassword, req.captain?.password);
  if (!isCorrect) {
    throw new AppError(400, "Old password is Invalid", "كلمة المرور القديمة غير صحيحة");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const result = await prisma.captain.update({
    where: { captainId: req.captain?.captainId },
    data: { password: hashedPassword },
  });

  return res.status(200).json({
    message: "Password updated successfully",
    body: result,
  });
}

async function logout(_req: Request, res: Response) {
  res.clearCookie("token");

  return res.status(200).json({
    message: "Logged out successfully",
  });
}

function me(req: Request, res: Response) {
  return res.status(200).json({ message: "You are in", body: req.captain });
}

const authController = {
  signup: asyncDec(signup),
  login: asyncDec(login),
  updatePassword: asyncDec(updatePassword),
  logout: asyncDec(logout),
  me: asyncDec(me),
};

export default authController;
