import mongoose from "mongoose";

// ─── Embedded: TomapoMessageProductSnapshot ───────────────────────

const productSnapshotSchema = new mongoose.Schema({
  barcode:          { type: String, required: true },
  batchId:          { type: String, default: null },
  productName:      { type: String, default: null },
  brand:            { type: String, default: null },
  quantity:         { type: String, default: null },
  imageUrl:         { type: String, default: null },
  nutriscoreGrade:  { type: String, default: null },
  ecoscoreGrade:    { type: String, default: null },
  categoriesTags:   [String],
  scannedAt:        { type: Date,   required: true },
  scannedAtStoreName:{ type: String, default: null },
}, { _id: false });

// ─── Main Schema ──────────────────────────────────────────────────

const userMessageSchema = new mongoose.Schema(
  {
    authorId:        { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User", index: true },
    authorNickname:  { type: String, required: true },  // denormalisiert
    category:        { type: String, required: true },  // AlertCategory
    title:           { type: String, required: true },
    body:            { type: String, required: true },
    severity:        { type: String, required: true },  // AlertSeverity
    submissionStatus:{ type: String, required: true, default: "pending" }, // MessageSubmissionStatus
    linkedAlertId:   { type: mongoose.Schema.Types.ObjectId, ref: "Alert", default: null },
    productSnapshot: { type: productSnapshotSchema, required: true },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────
userMessageSchema.index({ "productSnapshot.barcode": 1 });
userMessageSchema.index({ submissionStatus: 1 });

const UserMessage = mongoose.model("UserMessage", userMessageSchema, "user_messages");
export default UserMessage;