import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import newWeekScheduler from "./scheduler";

dotenv.config();

console.log("==== DB CONFIG ====");
console.log({
  URL: process.env.DATABASE_URL,
});

let prisma = new PrismaClient();

try {
  newWeekScheduler.start();
} catch (error) {
  console.error(error);
}

export { prisma };
export default prisma;
