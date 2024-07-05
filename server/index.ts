import express, { Application } from "express";
import cors from "cors";
import apiRouter from "./routes/api.route";
import alertRouter from "./routes/alert.route";
import { notFound, errorHandler } from "./middlewares/error.middleware";
import path from "path";
import cookieParser from "cookie-parser";

const app: Application = express();
const PORT: Number = process.env.PORT ? parseInt(process.env.PORT) : 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);
app.use("/alert", alertRouter);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "/client/dist")));

  app.get("*", (_, res) =>
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html")),
  );
} else {
  app.get("/", (_, res) => {
    res.send("API is running");
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started listening at port ${PORT}`);
});
