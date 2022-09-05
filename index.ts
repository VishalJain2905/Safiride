import * as express from "express";
import Mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./src/routes";
import path from "path";
import Exceptionhandler from "./src/utils/exceptionhandler";

const app = express.default();

dotenv.config({
  path: ".env",
});

Mongoose.connect(
  process.env.DB_URL ??
    "mongodb+srv://keshavsuman:8F4aPQhXD6Td6dn@chat-application.pqjjm.mongodb.net/weather_api"
);
Mongoose.connection.on("connected", () => {
  console.log("database connected");
});

app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

app.use("/", router);

app.use(Exceptionhandler);

app.use((req, res, next) => {
  res.status(404).json({
    message: "Not found error",
  });
});

app.listen(process.env.PORT ?? 5000, () => {
  console.log(`Server started at ${process.env.PORT}`);
});
