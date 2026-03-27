import { Router } from "express";
import {
  registerUser,
  loginUser,
  registerRetailer,
  loginRetailer,
  refresh,
  logout,
} from "./auth.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = Router();

// ─── User ──────────────────────────────────────────────────────
router.post("/user/register", registerUser);
router.post("/user/login",    loginUser);

// ─── Retailer ──────────────────────────────────────────────────
router.post("/retailer/register", registerRetailer);
router.post("/retailer/login",    loginRetailer);

// ─── Shared ────────────────────────────────────────────────────
router.post("/refresh", refresh);
router.post("/logout",  protect, logout);

export default router;