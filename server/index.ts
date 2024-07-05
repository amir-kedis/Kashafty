import express, { Application } from "express";
import cors from "cors";
import apiRouter from "./routes/api.route";
import alertRouter from "./routes/alert.route";
import { notFound, errorHandler } from "./middlewares/error.middleware";
import path from "path";
import cookieParser from "cookie-parser";

const app: Application = express();
const PORT: Number = process.env.PORT ? parseInt(process.env.PORT) : 5000;

// app.use(
//   cors({
//     origin: "https://kashafty.vercel.app",
//     methods: "GET,POST,PUT,DELETE",
//     allowedHeaders: "Content-Type,Authorization",
//     credentials: true,
//   }),
// );
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);
app.use("/alert", alertRouter);

app.get("/", (_, res) => {
  res.send("API is running");
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started listening at port ${PORT}`);
});
