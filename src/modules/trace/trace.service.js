import Trace from "./trace.model.js";
import { AppError } from "../../utils/appError.util.js";

// ─── GET by barcode (neueste Trace) ──────────────────────────────

export const getTraceByBarcode = async (barcode) => {
  const trace = await Trace.findOne({ barcode })
    .sort({ generatedAt: -1 })
    .lean();

  if (!trace) throw new AppError(`No trace found for barcode "${barcode}"`, 404);
  return trace;
};

// ─── GET by barcode + batchId ─────────────────────────────────────

export const getTraceByBarcodeAndBatch = async (barcode, batchId) => {
  const trace = await Trace.findOne({ barcode, batchId }).lean();
  if (!trace) {
    throw new AppError(`No trace found for barcode "${barcode}" and batchId "${batchId}"`, 404);
  }
  return trace;
};

// ─── GET alle Traces eines Barcodes (History) ─────────────────────

export const getAllTracesByBarcode = async (barcode) => {
  const traces = await Trace.find({ barcode })
    .select("barcode batchId generatedAt requiresColdChain traceabilityScore")
    .sort({ generatedAt: -1 })
    .lean();
  return traces;
};

// ─── CREATE ───────────────────────────────────────────────────────

export const createTrace = async (data) => {
  const trace = await Trace.create(data);
  return trace;
};

// ─── UPDATE (PATCH) ───────────────────────────────────────────────

export const updateTrace = async (id, data) => {
  const trace = await Trace.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).lean();

  if (!trace) throw new AppError("Trace not found", 404);
  return trace;
};

// ─── DELETE ───────────────────────────────────────────────────────

export const deleteTrace = async (id) => {
  const trace = await Trace.findByIdAndDelete(id);
  if (!trace) throw new AppError("Trace not found", 404);
};