import express, { Application } from "express";
import cors from "cors";
import apiRouter from "./routes/api.route";
import { notFound, errorHandler } from "./middlewares/error.middleware";
import cookieParser from "cookie-parser";
import cronRouter from "./routes/cron.route";

const app: Application = express();
const PORT: Number = process.env.PORT ? parseInt(process.env.PORT) : 5000;

const allowedOrigins = [
  "http://localhost:3000",
  "https://localhost:3000",
  "http://localhost:3001",
  "https://localhost:3001",
  "http://localhost:4173",
  "https://kashafty.vercel.app",
  "https://kashafty-amir-kedis-projects.vercel.app",
  "https://kashafty-git-main-amir-kedis-projects.vercel.app",
  "http://cron-job.org",
  "https://cron-job.org",
];

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
};

app.options("*", cors(corsOptions));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

app.use("/test", (_, res) => {
  res.send("Kashafty API nested endpoints is working fine finally");
});

app.use("/cron", cronRouter);

app.get("/", (_, res) => {
  res.send("Kashafty API is working fine ✨");
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started listening at port ${PORT}`);
});

export default app;
