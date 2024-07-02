import jwt from "jsonwebtoken";
import ms from "ms";

const generateToken = (res, id) => {
  // Generate a JWT token containing id
  // Bearer token is the token that we will be send to the client
  const token = jwt.sign(
    { id: id }, // Payload
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );

  const maxAge = ms(process.env.JWT_EXPIRES_IN);

  // Save token in cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // sameSite: 'strict',
    maxAge: maxAge,
  });
};

export default generateToken;
