import * as RetailerService from "./retailer.service.js";
import asyncHandler from "../../utils/asyncHandler.util.js";
import { sendSuccess, sendNoContent } from "../../utils/response.util.js";

// GET /api/v1/retailers/me
export const getMe = asyncHandler(async (req, res) => {
  const retailer = await RetailerService.getMe(req.user.id);
  sendSuccess(res, retailer);
});

// PATCH /api/v1/retailers/me
export const updateMe = asyncHandler(async (req, res) => {
  const retailer = await RetailerService.updateMe(req.user.id, req.body);
  sendSuccess(res, retailer, "Profile updated successfully");
});

// PATCH /api/v1/retailers/me/logo
export const updateLogo = asyncHandler(async (req, res) => {
  const { logoUrl } = req.body;
  const retailer = await RetailerService.updateLogo(req.user.id, logoUrl);
  sendSuccess(res, retailer, "Logo updated successfully");
});

// DELETE /api/v1/retailers/me
export const deleteMe = asyncHandler(async (req, res) => {
  await RetailerService.deleteMe(req.user.id);
  sendNoContent(res);
});

// GET /api/v1/retailers/:id  (Admin / intern)
export const getRetailerById = asyncHandler(async (req, res) => {
  const retailer = await RetailerService.getRetailerById(req.params.id);
  sendSuccess(res, retailer);
});