import { Router } from "express";
import {
  getMe,
  updateMe,
  updateAvatar,
  deleteMe,
  getMyMessages,
  getUserById,
} from "./user.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = Router();

// ── Eigenes Profil ────────────────────────────────────────────────
router.get("/me", protect, getMe);
router.patch("/me", protect, updateMe);
router.patch("/me/avatar", protect, updateAvatar);
router.delete("/me", protect, deleteMe);
router.get("/me/messages", protect, getMyMessages);

// ── Admin / intern ────────────────────────────────────────────────
router.get("/:id", protect, getUserById);

export default router;
