import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import newWeekScheduler from "./scheduler";

dotenv.config();

console.log("==== DB CONFIG ====");
console.log({
  URL: process.env.DATABASE_URL,
});

const prisma = new PrismaClient();

// newWeekScheduler.start();

export { prisma };
export default prisma;
