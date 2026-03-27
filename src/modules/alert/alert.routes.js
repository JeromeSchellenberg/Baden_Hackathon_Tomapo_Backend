import { Router } from "express";
import {
  getAlertsByBarcode,
  getAlertsByBarcodeAndBatch,
  getAlertById,
  createAlert,
  updateAlert,
  deleteAlert,
  confirmAlert,
  rejectAlert,
} from "./alert.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = Router();

// Public/authenticated
router.get("/:barcode", protect, getAlertsByBarcode);
router.get("/:barcode/batch/:batchId", protect, getAlertsByBarcodeAndBatch);
router.get("/id/:id", protect, getAlertById);

// Intern / moderation / admin
router.post("/", protect, createAlert);
router.patch("/:id", protect, updateAlert);
router.delete("/:id", protect, deleteAlert);

// Community interaction
router.post("/:id/confirm", protect, confirmAlert);
router.post("/:id/reject", protect, rejectAlert);

export default router;