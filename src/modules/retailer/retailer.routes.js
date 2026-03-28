import { Router } from "express";
import {
  getMe,
  updateMe,
  updateLogo,
  deleteMe,
  getRetailerById,
} from "./retailer.controller.js";
import { protect, authorize } from "../../middlewares/auth.middleware.js";

const router = Router();

// ── Eigenes Profil — nur für eingeloggte Retailer ─────────────────
router.get("/me", protect, authorize("retailer"), getMe);
router.patch("/me", protect, authorize("retailer"), updateMe);
router.patch("/me/logo", protect, authorize("retailer"), updateLogo);
router.delete("/me", protect, authorize("retailer"), deleteMe);

// ── Admin / intern ────────────────────────────────────────────────
router.get("/:id", protect, getRetailerById);

export default router;
