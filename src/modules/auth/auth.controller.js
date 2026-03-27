import * as AuthService from "./auth.service.js";
import asyncHandler from "../../utils/asyncHandler.util.js";
import { sendSuccess, sendCreated } from "../../utils/response.util.js";

// ─── User ────────────────────────────────────────────────────────

export const registerUser = asyncHandler(async (req, res) => {
  const result = await AuthService.registerUser(req.body);
  sendCreated(res, result, "User registered successfully");
});

export const loginUser = asyncHandler(async (req, res) => {
  const result = await AuthService.loginUser(req.body);
  sendSuccess(res, result, "Login successful");
});

// ─── Retailer ────────────────────────────────────────────────────

export const registerRetailer = asyncHandler(async (req, res) => {
  const result = await AuthService.registerRetailer(req.body);
  sendCreated(res, result, "Retailer registered successfully");
});

export const loginRetailer = asyncHandler(async (req, res) => {
  const result = await AuthService.loginRetailer(req.body);
  sendSuccess(res, result, "Login successful");
});

// ─── Shared ──────────────────────────────────────────────────────

export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const tokens = await AuthService.refreshTokens(refreshToken);
  sendSuccess(res, tokens, "Tokens refreshed");
});

export const logout = asyncHandler(async (req, res) => {
  await AuthService.logout(req.user.id, req.user.role);
  sendSuccess(res, null, "Logged out successfully");
});