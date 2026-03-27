import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ⚠️  PLACEHOLDER — wird erweitert sobald das finale Retailer-Schema vorliegt

const retailerSchema = new mongoose.Schema(
  {
    companyName:  { type: String, required: true, trim: true },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:     { type: String, required: true, select: false },
    logoUrl:      { type: String, default: null },
    refreshToken: { type: String, select: false, default: null },

    // TODO: restliche Felder aus finalem Schema ergänzen (GLN, Adresse, etc.)
  },
  { timestamps: true }
);

retailerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

retailerSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Retailer = mongoose.model("Retailer", retailerSchema);
export default Retailer;