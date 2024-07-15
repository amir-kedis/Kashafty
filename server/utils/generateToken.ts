import { Response } from "express";
import jwt from "jsonwebtoken";
import ms from "ms";

const generateToken = (res: Response, id: string): string => {
  // Generate a JWT token containing id
  // Bearer token is the token that we will be send to the client
  const token = jwt.sign(
    { id: id }, // Payload
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env.JWT_EXPIRES_IN as string,
    },
  );

  const maxAge = ms(process.env.JWT_EXPIRES_IN as string);

  // Save token in cookie
  res.cookie("token", token, {
    httpOnly: false,
    secure: true,
    // sameSite: 'strict',
    sameSite: "none",
    maxAge: maxAge,
  });

  return token;
};

export default generateToken;
