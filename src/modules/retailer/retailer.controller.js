import * as RetailerService from "./retailer.service.js";
import asyncHandler from "../../utils/asyncHandler.util.js";
import { sendSuccess, sendCreated, sendNoContent } from "../../utils/response.util.js";

// ─── GET all retailers ──────────────────────────────────────────
// GET /api/v1/retailers
export const getAllRetailers = asyncHandler(async (req, res) => {
    const retailers = await RetailerService.getAllRetailers();
    sendSuccess(res, retailers);
});

// ─── GET retailer by ID ─────────────────────────────────────────
// GET /api/v1/retailers/:id
export const getRetailerById = asyncHandler(async (req, res) => {
    const retailer = await RetailerService.getRetailerById(req.params.id);
    sendSuccess(res, retailer);
});

// ─── CREATE retailer ────────────────────────────────────────────
// POST /api/v1/retailers
export const createRetailer = asyncHandler(async (req, res) => {
    const retailer = await RetailerService.createRetailer(req.body);
    sendCreated(res, retailer, "Retailer created successfully");
});

// ─── UPDATE retailer ────────────────────────────────────────────
// PATCH /api/v1/retailers/:id
export const updateRetailer = asyncHandler(async (req, res) => {
    const retailer = await RetailerService.updateRetailer(
        req.params.id,
        req.body
    );
    sendSuccess(res, retailer, "Retailer updated successfully");
});

// ─── DELETE retailer ────────────────────────────────────────────
// DELETE /api/v1/retailers/:id
export const deleteRetailer = asyncHandler(async (req, res) => {
    await RetailerService.deleteRetailer(req.params.id);
    sendNoContent(res);
});