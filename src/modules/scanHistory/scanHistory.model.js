import mongoose from "mongoose";

const scanHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    barcode: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    barcodeType: {
      type: String,
      required: true,
      trim: true,
    },
    batchId: {
      type: String,
      default: null,
      trim: true,
    },
    productName: {
      type: String,
      default: null,
      trim: true,
    },
    brand: {
      type: String,
      default: null,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: null,
      trim: true,
    },
    nutriscoreGrade: {
      type: String,
      default: null,
      trim: true,
      lowercase: true,
    },
    ecoscoreGrade: {
      type: String,
      default: null,
      trim: true,
      lowercase: true,
    },
    co2KgPerKg: {
      type: Number,
      default: null,
    },
    productStatus: {
      type: String,
      required: true,
      enum: ["ok", "recallActive", "mhdExpired", "mhdSoonExpiring", "unknown"],
      default: "unknown",
    },
    bestBeforeDate: {
      type: Date,
      default: null,
    },
    scannedAt: {
      type: Date,
      required: true,
      index: true,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

scanHistorySchema.index({ userId: 1, scannedAt: -1 });
scanHistorySchema.index({ userId: 1, barcode: 1, scannedAt: -1 });

const ScanHistory = mongoose.model(
  "ScanHistory",
  scanHistorySchema,
  "scan_history"
);
export default ScanHistory;
