import { Router } from "express";
import {
  getMyMessages,
  getMessageById,
  createMessage,
  updateSubmissionStatus,
  deleteMessage,
  getMessagesByBarcode,
} from "./userMessages.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = Router();

// ── Eigene Meldungen ──────────────────────────────────────────────
router.get("/", protect, getMyMessages);
router.get("/:id", protect, getMessageById);
router.post("/", protect, createMessage);
router.patch("/:id/status", protect, updateSubmissionStatus);
router.delete("/:id", protect, deleteMessage);

// ── Admin / Moderation ────────────────────────────────────────────
router.get("/barcode/:barcode", protect, getMessagesByBarcode);

export default router;
