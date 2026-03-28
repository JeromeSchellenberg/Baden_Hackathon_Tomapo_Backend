import mongoose from "mongoose";

// ─── Embedded: TomapoMessageProductSnapshot ───────────────────────

const productSnapshotSchema = new mongoose.Schema({
  barcode:          { type: String},
  batchId:          { type: String, default: null },
  productName:      { type: String, default: null },
  brand:            { type: String, default: null },
  quantity:         { type: String, default: null },
  imageUrl:         { type: String, default: null },
  nutriscoreGrade:  { type: String, default: null },
  ecoscoreGrade:    { type: String, default: null },
  categoriesTags:   [String],
  scannedAt:        { type: Date},
  scannedAtStoreName:{ type: String, default: null },
}, { _id: false });

// ─── Main Schema ──────────────────────────────────────────────────

const userMessageSchema = new mongoose.Schema(
  {
    authorId:        { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    authorNickname:  { type: String},  // denormalisiert
    category:        { type: String},  // AlertCategory
    title:           { type: String},
    body:            { type: String},
    severity:        { type: String},  // AlertSeverity
    submissionStatus:{ type: String, default: "pending" }, // MessageSubmissionStatus
    linkedAlertId:   { type: mongoose.Schema.Types.ObjectId, ref: "Alert", default: null },
    productSnapshot: { type: productSnapshotSchema},
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────
userMessageSchema.index({ "productSnapshot.barcode": 1 });
userMessageSchema.index({ submissionStatus: 1 });

const UserMessage = mongoose.model("UserMessage", userMessageSchema, "user_messages");
export default UserMessage;