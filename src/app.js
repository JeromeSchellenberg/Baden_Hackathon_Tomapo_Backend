import express from "express";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import productRoutes from "./modules/product/product.routes.js";
import traceRoutes from "./modules/trace/trace.routes.js";
import scanHistoryRoutes from "./modules/scanHistory/scanHistory.routes.js";
import alertRoutes from "./modules/alert/alert.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import retailerRoutes from "./modules/retailer/retailer.routes.js";
import userMessageRoutes from "./modules/userMessages/userMessages.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/traces", traceRoutes);
app.use("/api/v1/scan-history", scanHistoryRoutes);
app.use("/api/v1/alerts", alertRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/retailers", retailerRoutes);
app.use("/api/v1/user-messages", userMessageRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    status: 404,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

app.use(errorHandler);
export default app;
