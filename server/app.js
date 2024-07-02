import express from "express";
import cors from "cors";
import db from "./database/db.js";
import apiRouter from "./routes/api.route.js";
import alertRouter from "./routes/alert.route.js";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";
import path from "path";
import cookieParser from "cookie-parser";
const app = express();
const PORT = process.env.PORT || 5000;

db.connect()
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err) => {
    if (err) return console.error(err);
  });

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);
app.use("/alert", alertRouter);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "/client/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html")),
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running");
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, (err) => {
  if (err) return console.error(err);
  console.log(`Server started listening at port ${PORT}`);
});
