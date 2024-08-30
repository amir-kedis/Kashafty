import { Request } from "express";
import { Strategy, StrategyOptionsWithSecret } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import prisma from "../database/db";

// Cookie extractor
function cookieExtractor(req: Request) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["token"];
  }
  return token;
}

const opts: StrategyOptionsWithSecret = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    cookieExtractor,
  ]),
  secretOrKey: process.env.JWT_SECRET || "secret",
};

export default new Strategy(opts, async (payload, done) => {
  try {
    // Check if user exists
    const user = await prisma.captain.findUnique({
      where: { captainId: parseInt(payload.id) },
    });

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
});
