import User from "./user.model.js";
import { AppError } from "../../utils/appError.util.js";

// ─── GET aktueller User (aus Token) ──────────────────────────────

export const getMe = async (userId) => {
  const user = await User.findById(userId).lean();
  if (!user) throw new AppError("User not found", 404);
  return user;
};

// ─── GET User by ID ───────────────────────────────────────────────

export const getUserById = async (id) => {
  const user = await User.findById(id).lean();
  if (!user) throw new AppError("User not found", 404);
  return user;
};

// ─── UPDATE eigenes Profil ────────────────────────────────────────

export const updateMe = async (userId, data) => {
  // Passwort und sensible Felder dürfen hier nicht geändert werden
  const forbidden = ["password", "refreshToken", "email", "role"];
  forbidden.forEach((f) => delete data[f]);

  const user = await User.findByIdAndUpdate(userId, data, {
    new: true,
    runValidators: true,
  }).lean();

  if (!user) throw new AppError("User not found", 404);
  return user;
};

// ─── UPDATE Avatar ────────────────────────────────────────────────

export const updateAvatar = async (userId, avatarUrl) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { avatarUrl },
    { new: true }
  ).lean();
  if (!user) throw new AppError("User not found", 404);
  return user;
};

// ─── DELETE eigenen Account ───────────────────────────────────────

export const deleteMe = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) throw new AppError("User not found", 404);
};

// ─── GET Meldungshistorie (messages[]) ───────────────────────────

export const getMyMessages = async (userId) => {
  const user = await User.findById(userId).select("messages").lean();
  if (!user) throw new AppError("User not found", 404);
  return user.messages ?? [];
};

// ─── Sync: MessageSummary nach neuer UserMessage hinzufügen ──────
// Wird intern vom UserMessage-Service aufgerufen

export const appendMessageSummary = async (userId, summary) => {
  await User.findByIdAndUpdate(userId, {
    $push: { messages: { $each: [summary], $position: 0 } }, // neueste zuerst
  });
};

export const updateMessageSummary = async (userId, messageId, updates) => {
  await User.updateOne(
    { _id: userId, "messages.id": messageId },
    { $set: { "messages.$": { ...updates } } }
  );
};