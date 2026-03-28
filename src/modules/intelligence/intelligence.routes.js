import { Router } from "express";
import { healthCheck, analyze, chat } from "./intelligence.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = Router();

// Health check — intern, kein Token nötig
router.get("/health", healthCheck);

// Analyse — authentifiziert
router.post("/analyze/:barcode", protect, analyze);

// Chat Streaming — authentifiziert
router.post("/chat/:barcode", protect, chat);

export default router;