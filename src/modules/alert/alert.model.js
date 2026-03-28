import mongoose from "mongoose";

const ALERT_SOURCES = ["official", "retailer", "community"];
const ALERT_STATUSES = ["active", "resolved", "rejected"];
const ALERT_SEVERITIES = ["low", "medium", "high", "critical"];

// Annahme:
// Die Kategorien sind im HTML nur als "AlertCategory" benannt, aber nicht final enumeriert.
// Deshalb lasse ich category bewusst als freien String mit required.
const alertSchema = new mongoose.Schema(
  {
    barcode: {
      type: String,
      index: true,
      trim: true,
    },
    batchId: {
      type: String,
      default: null,
      index: true,
      trim: true,
    },
    source: {
      type: String,
      enum: ALERT_SOURCES,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    severity: {
      type: String,
      enum: ALERT_SEVERITIES,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    actionRequired: {
      type: String,
      default: null,
      trim: true,
    },
    referenceId: {
      type: String,
      default: null,
      trim: true,
    },
    moreInfoUrl: {
      type: String,
      default: null,
      trim: true,
    },

    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    authorNickname: {
      type: String,
      default: null,
      trim: true,
    },
    authorAvatarUrl: {
      type: String,
      default: null,
      trim: true,
    },
    authorLogoUrl: {
      type: String,
      default: null,
      trim: true,
    },

    retailerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Retailer",
      default: null,
      index: true,
    },

    status: {
      type: String,
      required: true,
      enum: ALERT_STATUSES,
      default: "active",
      index: true,
    },

    confirmationCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    rejectionCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

// Sinnvolle Query-Indizes
alertSchema.index({ barcode: 1, status: 1, createdAt: -1 });
alertSchema.index({ barcode: 1, batchId: 1, status: 1, createdAt: -1 });
alertSchema.index({ source: 1, category: 1, severity: 1 });

const Alert = mongoose.model("Alert", alertSchema, "alerts");

export default Alert;