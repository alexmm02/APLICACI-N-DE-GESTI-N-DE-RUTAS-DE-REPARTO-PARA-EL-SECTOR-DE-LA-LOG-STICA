import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import packagesRoutes from "./routes/packages.routes.js"
import authRoutes from "./routes/auth.routes.js";
import supportRoutes from "./routes/support.routes.js"
import routesRoutes from "./routes/routes.routes.js"
import companyRoutes from "./routes/companies.routes.js"
import timeRoutes from "./routes/time.routes.js"
import { ORIGIN } from "./config.js";
import { pool } from "./db.js";

const app = express();

app.use(
  cors({
    origin: ORIGIN,
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.get("/", (req, res) => res.json({ message: "welcome to my API" }));
app.get("/api/ping", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  return res.json(result.rows[0]);
});
app.use("/api", packagesRoutes);
app.use("/api", authRoutes);
app.use("/api", supportRoutes);
app.use("/api", routesRoutes);
app.use("/api", companyRoutes);
app.use("/api", timeRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({
    status: "error",
    message: err.message,
  });
});

export default app;