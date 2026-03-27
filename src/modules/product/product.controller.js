import * as OFFService from "../OFF/off.service.js";
import asyncHandler from "../../utils/asyncHandler.util.js";
import { sendSuccess } from "../../utils/response.util.js";

// GET /api/v1/products/:barcode
export const getProduct = asyncHandler(async (req, res) => {
  const { barcode } = req.params;
  const { source, product } = await OFFService.getProductByBarcode(barcode);

  sendSuccess(res, product, "Product fetched successfully", 200);

  // Source im Header mitschicken — nützlich für Debugging
  res.set("X-Data-Source", source);
});