import User from "../user/user.model.js";
import Retailer from "../retailer/retailer.model.js";
import { AppError } from "../../utils/appError.util.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/token.util.js";

// ─── Helpers ────────────────────────────────────────────────────

function buildTokenPayload(doc, role) {
  return { id: doc._id, role };
}

async function attachRefreshToken(doc, role) {
  const payload      = buildTokenPayload(doc, role);
  const accessToken  = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  doc.refreshToken = refreshToken;
  await doc.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
}

// ─── User Auth ──────────────────────────────────────────────────

export const registerUser = async ({ fullName, email, nickname, password }) => {
  const existing = await User.findOne({ $or: [{ email }, { nickname }] });
  if (existing) {
    const field = existing.email === email ? "Email" : "Nickname";
    throw new AppError(`${field} is already taken`, 409);
  }

  const user   = await User.create({ fullName, email, nickname, password });
  const tokens = await attachRefreshToken(user, "user");

  return { user: { id: user._id, fullName: user.fullName, email: user.email, nickname: user.nickname }, ...tokens };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password +refreshToken");
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  const tokens = await attachRefreshToken(user, "user");
  return { user: { id: user._id, fullName: user.fullName, email: user.email, nickname: user.nickname }, ...tokens };
};

// ─── Retailer Auth ──────────────────────────────────────────────

export const registerRetailer = async ({ companyName, email, password }) => {
  const existing = await Retailer.findOne({ email });
  if (existing) throw new AppError("Email is already taken", 409);

  const retailer = await Retailer.create({ companyName, email, password });
  const tokens   = await attachRefreshToken(retailer, "retailer");

  return { retailer: { id: retailer._id, companyName: retailer.companyName, email: retailer.email }, ...tokens };
};

export const loginRetailer = async ({ email, password }) => {
  const retailer = await Retailer.findOne({ email }).select("+password +refreshToken");
  if (!retailer || !(await retailer.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  const tokens = await attachRefreshToken(retailer, "retailer");
  return { retailer: { id: retailer._id, companyName: retailer.companyName, email: retailer.email }, ...tokens };
};

// ─── Shared: Refresh & Logout ───────────────────────────────────

export const refreshTokens = async (token) => {
  if (!token) throw new AppError("No refresh token provided", 401);

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const Model = payload.role === "retailer" ? Retailer : User;
  const doc   = await Model.findById(payload.id).select("+refreshToken");

  if (!doc || doc.refreshToken !== token) {
    throw new AppError("Refresh token mismatch. Please log in again.", 401);
  }

  const tokens = await attachRefreshToken(doc, payload.role);
  return tokens;
};

export const logout = async (id, role) => {
  const Model = role === "retailer" ? Retailer : User;
  await Model.findByIdAndUpdate(id, { refreshToken: null });
};