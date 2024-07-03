import pg, { Pool } from "pg";
import dotenv from "dotenv";
import newWeekScheduler from "./scheduler";

dotenv.config();

console.log("==== DB CONFIG ====");
console.log({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  URL: process.env.DATABASE_URL,
});

let db: Pool;

if (process.env.DB === "online") {
  console.log("trying to connect to online db");
  db = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  console.log("trying to connect to local db");
  db = new pg.Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432", 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
  });
}

newWeekScheduler.start();

export default db;
