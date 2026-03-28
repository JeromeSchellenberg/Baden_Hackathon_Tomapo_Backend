import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ─── Embedded: TomapoUserMessageSummary ──────────────────────────

const userMessageSummarySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, note: "= user_messages._id" },
    barcode: { type: String, required: true },
    batchId: { type: String, default: null },
    productName: { type: String, default: null },
    productBrand: { type: String, default: null },
    productCategoryTag: { type: String, default: null },
    messageTitle: { type: String, required: true },
    messageCategory: { type: String, required: true },
    messageSeverity: { type: String, required: true },
    submissionStatus: { type: String, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { _id: false }
);

// ─── Main Schema ──────────────────────────────────────────────────

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    nickname: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, select: false },
    avatarUrl: { type: String, default: null },
    refreshToken: { type: String, select: false, default: null },
    isSyncedWithBackend: { type: Boolean, required: true, default: false },

    // Denormalisierte Meldungshistorie — wird bei jeder neuen UserMessage synchronisiert
    messages: [userMessageSummarySchema],
  },
  { timestamps: true }
);

// ─── Hooks ───────────────────────────────────────────────────────
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema, "users");
export default User;
