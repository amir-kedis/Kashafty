import pg from "pg";
import dotenv from "dotenv";
import newWeekScheduler from "./scheduler.js";

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

let _db;
if (process.env.DB === "online") {
  console.log("trying to connect to online db");
  _db = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  console.log("trying to connect to local db");
  _db = new pg.Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    URL: process.env.DATABASE_URL,
  });
}

const db = _db;

newWeekScheduler.start();

export default db;
