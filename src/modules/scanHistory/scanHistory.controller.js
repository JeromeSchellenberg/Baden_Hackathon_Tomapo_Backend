import * as ScanHistoryService from "./scanHistory.service.js";
import asyncHandler from "../../utils/asyncHandler.util.js";
import { sendSuccess, sendCreated, sendNoContent } from "../../utils/response.util.js";

// GET /api/v1/scan-history
export const getMyScanHistory = asyncHandler(async (req, res) => {
    const history = await ScanHistoryService.getScanHistoryByUser(req.user.id);
    sendSuccess(res, history);
});

// GET /api/v1/scan-history/:id
export const getScanHistoryById = asyncHandler(async (req, res) => {
    const item = await ScanHistoryService.getScanHistoryById(req.params.id);
    sendSuccess(res, item);
});

// POST /api/v1/scan-history
export const createScanHistory = asyncHandler(async (req, res) => {
    const payload = {
        ...req.body,
        userId: req.user.id,
    };

    const item = await ScanHistoryService.createScanHistory(payload);
    sendCreated(res, item, "Scan history entry created successfully");
});

// PATCH /api/v1/scan-history/:id
export const updateScanHistory = asyncHandler(async (req, res) => {
    const item = await ScanHistoryService.updateScanHistory(req.params.id, req.body);
    sendSuccess(res, item, "Scan history entry updated successfully");
});

// DELETE /api/v1/scan-history/:id
export const deleteScanHistory = asyncHandler(async (req, res) => {
    await ScanHistoryService.deleteScanHistory(req.params.id);
    sendNoContent(res);
});

// DELETE /api/v1/scan-history
export const clearMyScanHistory = asyncHandler(async (req, res) => {
    await ScanHistoryService.deleteAllScanHistoryByUser(req.user.id);
    sendNoContent(res);
});