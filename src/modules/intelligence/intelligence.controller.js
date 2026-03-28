import * as IntelligenceService from "./intelligence.service.js";
import Trace from "../trace/trace.model.js";
import ProductCache from "../product/product.model.js";
import { AppError } from "../../utils/appError.util.js";
import asyncHandler from "../../utils/asyncHandler.util.js";
import { sendSuccess } from "../../utils/response.util.js";

// ─── GET /api/v1/intelligence/health ─────────────────────────────

export const healthCheck = asyncHandler(async (req, res) => {
  const status = await IntelligenceService.checkHealth();
  sendSuccess(res, status, "Intelligence service is healthy");
});

// ─── POST /api/v1/intelligence/analyze/:barcode ───────────────────

export const analyze = asyncHandler(async (req, res) => {
  const { barcode } = req.params;
  const { batchId }  = req.query;

  const query = batchId ? { barcode, batchId } : { barcode };
  const trace = await Trace.findOne(query).sort({ generatedAt: -1 }).lean();
  if (!trace) throw new AppError(`No trace found for barcode "${barcode}"`, 404);

  const product = await ProductCache.findOne({ barcode }).lean();

  const intelligence = await IntelligenceService.analyzeTrace(trace);

  sendSuccess(res, {
    trace,
    product:      product ?? null,
    intelligence: intelligence ?? null,
  });
});

// ─── POST /api/v1/intelligence/chat/:barcode ──────────────────────
// Streamt text/plain vom Python FastAPI direkt zum Client.
// Verwendet Web Streams API (Node 18+) — kein .pipe() nötig.

export const chat = asyncHandler(async (req, res) => {
  const { barcode } = req.params;
  const { batchId, chatHistory, batchContext } = req.body;

  if (!chatHistory || !Array.isArray(chatHistory) || chatHistory.length === 0) {
    throw new AppError("chatHistory is required and must be a non-empty array", 400);
  }

  if (!batchContext) {
    throw new AppError("batchContext (full /analyze response) is required", 400);
  }

  const product = await ProductCache.findOne({ barcode }).lean();

  const upstream = await IntelligenceService.streamChat({
    batchId:     batchId ?? null,
    productId:   barcode,
    chatHistory,
    batchContext,
    productInfo: product ?? {},
  });

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Web Streams API (Node 18+): ReadableStream → Response-Chunks zum Client senden
  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value, { stream: true }));
    }
  } finally {
    reader.releaseLock();
    res.end();
  }
});