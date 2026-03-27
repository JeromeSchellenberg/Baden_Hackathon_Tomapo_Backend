import { Router } from "express";
import {
    getMyScanHistory,
    getScanHistoryById,
    createScanHistory,
    updateScanHistory,
    deleteScanHistory,
    clearMyScanHistory,
} from "./scanHistory.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = Router();

// ── User Scan History ────────────────────────────────────────────
router.get("/", protect, getMyScanHistory);
router.get("/:id", protect, getScanHistoryById);
router.post("/", protect, createScanHistory);
router.patch("/:id", protect, updateScanHistory);
router.delete("/:id", protect, deleteScanHistory);
router.delete("/", protect, clearMyScanHistory);

export default router;