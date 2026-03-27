import * as TraceService from "./trace.service.js";
import asyncHandler from "../../utils/asyncHandler.util.js";
import { sendSuccess, sendCreated, sendNoContent } from "../../utils/response.util.js";

// GET /api/v1/traces/:barcode
export const getTraceByBarcode = asyncHandler(async (req, res) => {
  const trace = await TraceService.getTraceByBarcode(req.params.barcode);
  sendSuccess(res, trace);
});

// GET /api/v1/traces/:barcode/batch/:batchId
export const getTraceByBarcodeAndBatch = asyncHandler(async (req, res) => {
  const trace = await TraceService.getTraceByBarcodeAndBatch(
    req.params.barcode,
    req.params.batchId
  );
  sendSuccess(res, trace);
});

// GET /api/v1/traces/:barcode/history
export const getAllTracesByBarcode = asyncHandler(async (req, res) => {
  const traces = await TraceService.getAllTracesByBarcode(req.params.barcode);
  sendSuccess(res, traces);
});

// POST /api/v1/traces
export const createTrace = asyncHandler(async (req, res) => {
  const trace = await TraceService.createTrace(req.body);
  sendCreated(res, trace, "Trace created successfully");
});

// PATCH /api/v1/traces/:id
export const updateTrace = asyncHandler(async (req, res) => {
  const trace = await TraceService.updateTrace(req.params.id, req.body);
  sendSuccess(res, trace, "Trace updated successfully");
});

// DELETE /api/v1/traces/:id
export const deleteTrace = asyncHandler(async (req, res) => {
  await TraceService.deleteTrace(req.params.id);
  sendNoContent(res);
});