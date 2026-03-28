import Retailer from "./retailer.model.js";
import { AppError } from "../../utils/appError.util.js";

// ─── GET aktueller Retailer (aus Token) ──────────────────────────

export const getMe = async (retailerId) => {
  const retailer = await Retailer.findById(retailerId).lean();
  if (!retailer) throw new AppError("Retailer not found", 404);
  return retailer;
};

// ─── GET Retailer by ID (Admin / intern) ─────────────────────────

export const getRetailerById = async (id) => {
  const retailer = await Retailer.findById(id).lean();
  if (!retailer) throw new AppError("Retailer not found", 404);
  return retailer;
};

// ─── UPDATE eigenes Profil ────────────────────────────────────────

export const updateMe = async (retailerId, data) => {
  // Sensible Felder dürfen hier nicht geändert werden
  const forbidden = ["password", "refreshToken", "email"];
  forbidden.forEach((f) => delete data[f]);

  const retailer = await Retailer.findByIdAndUpdate(retailerId, data, {
    new: true,
    runValidators: true,
  }).lean();

  if (!retailer) throw new AppError("Retailer not found", 404);
  return retailer;
};

// ─── UPDATE Logo ──────────────────────────────────────────────────

export const updateLogo = async (retailerId, logoUrl) => {
  const retailer = await Retailer.findByIdAndUpdate(
    retailerId,
    { logoUrl },
    { new: true }
  ).lean();
  if (!retailer) throw new AppError("Retailer not found", 404);
  return retailer;
};

// ─── DELETE eigenen Account ───────────────────────────────────────

export const deleteMe = async (retailerId) => {
  const retailer = await Retailer.findByIdAndDelete(retailerId);
  if (!retailer) throw new AppError("Retailer not found", 404);
};