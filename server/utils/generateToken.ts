import jwt from "jsonwebtoken";

function generateAccessJWT(userId: string): {
  token: string;
  expiresIn: string;
} {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN as string,
  });

  return {
    token,
    expiresIn: process.env.JWT_EXPIRES_IN as string,
  };
}

export default generateAccessJWT;
