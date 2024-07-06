import express, { Application } from "express";
import cors from "cors";
import apiRouter from "./routes/api.route";
import alertRouter from "./routes/alert.route";
import { notFound, errorHandler } from "./middlewares/error.middleware";
import cookieParser from "cookie-parser";

const app: Application = express();
const PORT: Number = process.env.PORT ? parseInt(process.env.PORT) : 5000;

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.options("*", cors(corsOptions));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);
app.use("/alert", alertRouter);

app.use("/test", (_, res) => {
  res.send("Outer endpoint running");
});

app.get("/test1", (_, res) => {
  res.send("API is running");
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started listening at port ${PORT}`);
});

export default app;
