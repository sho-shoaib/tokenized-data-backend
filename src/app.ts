import express from "express";
import cors from "cors";
import path from "path";
import { env } from "./config/env.js";
import apiRouter from "./routes/index.js";
import { errorHandler } from "./middleware/error.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.resolve(env.UPLOAD_DIR)));

app.use("/api", apiRouter);

app.use(errorHandler);

export default app;
