import * as AlertService from "./alert.service.js";
import asyncHandler from "../../utils/asyncHandler.util.js";
import {
  sendSuccess,
  sendCreated,
  sendNoContent,
} from "../../utils/response.util.js";

// GET /api/v1/alerts/:barcode
export const getAlertsByBarcode = asyncHandler(async (req, res) => {
  const alerts = await AlertService.getAlertsByBarcode(req.params.barcode, {
    includeExpired: req.query.includeExpired === "true",
    includeResolved: req.query.includeResolved !== "false",
  });

  sendSuccess(res, alerts);
});

// GET /api/v1/alerts/:barcode/batch/:batchId
export const getAlertsByBarcodeAndBatch = asyncHandler(async (req, res) => {
  const alerts = await AlertService.getAlertsByBarcodeAndBatch(
    req.params.barcode,
    req.params.batchId,
    {
      includeExpired: req.query.includeExpired === "true",
      includeResolved: req.query.includeResolved !== "false",
    }
  );

  sendSuccess(res, alerts);
});

// GET /api/v1/alerts/id/:id
export const getAlertById = asyncHandler(async (req, res) => {
  const alert = await AlertService.getAlertById(req.params.id);
  sendSuccess(res, alert);
});

// GET /api/v1/alerts/source/retailer
export const getRetailerAlerts = asyncHandler(async (req, res) => {
  const alerts = await AlertService.getRetailerAlerts({
    includeExpired: req.query.includeExpired === "true",
  });
  sendSuccess(res, alerts);
});

// GET /api/v1/alerts/source/community
export const getCommunityAlerts = asyncHandler(async (req, res) => {
  const alerts = await AlertService.getCommunityAlerts({
    includeExpired: req.query.includeExpired === "true",
  });
  sendSuccess(res, alerts);
});

// POST /api/v1/alerts
export const createAlert = asyncHandler(async (req, res) => {
  const alert = await AlertService.createAlert(req.body);
  sendCreated(res, alert, "Alert created successfully");
});

// PATCH /api/v1/alerts/:id
export const updateAlert = asyncHandler(async (req, res) => {
  const alert = await AlertService.updateAlert(req.params.id, req.body);
  sendSuccess(res, alert, "Alert updated successfully");
});

// DELETE /api/v1/alerts/:id
export const deleteAlert = asyncHandler(async (req, res) => {
  await AlertService.deleteAlert(req.params.id);
  sendNoContent(res);
});

// POST /api/v1/alerts/:id/confirm
export const confirmAlert = asyncHandler(async (req, res) => {
  const alert = await AlertService.confirmAlert(req.params.id);
  sendSuccess(res, alert, "Alert confirmed successfully");
});

// POST /api/v1/alerts/:id/reject
export const rejectAlert = asyncHandler(async (req, res) => {
  const alert = await AlertService.rejectAlert(req.params.id);
  sendSuccess(res, alert, "Alert rejected successfully");
});