import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import config from "./config/index.js";
import initRouteApi from "./router/index.js";
import { APIError } from "./utils/index.js";

const app = express();

app.use(
  cors({
    origin: config.app.clientURL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// init router
initRouteApi(app);

// handle 404 response
app.use((req, res, next) => {
  return next(new APIError(404, "Url not found"));
});

// define error-handling middleware last, after other app.use() and routes calls
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  console.log("ERROR:::", error);
  return res.status(statusCode).json({
    status: "ERROR",
    message,
  });
});

export default app;
