import { Router } from "express";
import {
  getTraceByBarcode,
  getTraceByBarcodeAndBatch,
  getAllTracesByBarcode,
  createTrace,
  updateTrace,
  deleteTrace,
} from "./trace.controller.js";
import { protect, authorize } from "../../middlewares/auth.middleware.js";

const router = Router();

// ── Public (authenticated) — Swift App & Retailer ────────────────
router.get("/:barcode", protect, getTraceByBarcode);
router.get("/:barcode/batch/:batchId", protect, getTraceByBarcodeAndBatch);
router.get("/:barcode/history", protect, getAllTracesByBarcode);

// ── Admin / intern — nur für interne Datenpflege ─────────────────
router.post("/", protect, createTrace);
router.patch("/:id", protect, updateTrace);
router.delete("/:id", protect, deleteTrace);

export default router;
