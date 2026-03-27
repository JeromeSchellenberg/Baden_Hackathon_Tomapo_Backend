import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ⚠️  PLACEHOLDER — wird vom Teammitglied mit dem finalen Schema erweitert
// Pflichtfelder für Auth sind bereits gesetzt, restliche User-Felder folgen

const userSchema = new mongoose.Schema(
  {
    fullName:     { type: String, required: true, trim: true },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    nickname:     { type: String, required: true, unique: true, trim: true },
    password:     { type: String, required: true, select: false },
    avatarUrl:    { type: String, default: null },
    refreshToken: { type: String, select: false, default: null },

    // TODO: restliche Felder aus finalem Schema ergänzen
  },
  { timestamps: true }
);

// Hash password vor dem Speichern
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Passwort vergleichen
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;