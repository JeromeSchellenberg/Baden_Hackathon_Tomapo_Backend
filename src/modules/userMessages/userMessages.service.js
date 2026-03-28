import UserMessage from "./userMessages.model.js";
import User from "../user/user.model.js";
import { AppError } from "../../utils/appError.util.js";

// ─── Helpers ─────────────────────────────────────────────────────

function buildSummary(msg) {
  return {
    id: msg._id.toString(),
    barcode: msg.productSnapshot.barcode,
    batchId: msg.productSnapshot.batchId ?? null,
    productName: msg.productSnapshot.productName ?? null,
    productBrand: msg.productSnapshot.brand ?? null,
    productCategoryTag: msg.productSnapshot.categoriesTags?.[0] ?? null,
    messageTitle: msg.title,
    messageCategory: msg.category,
    messageSeverity: msg.severity,
    submissionStatus: msg.submissionStatus,
    createdAt: msg.createdAt,
    updatedAt: msg.updatedAt,
  };
}

// ─── GET alle Meldungen des eingeloggten Users ────────────────────

export const getMyMessages = async (userId) => {
  return UserMessage.find({ authorId: userId }).sort({ createdAt: -1 }).lean();
};

// ─── GET einzelne Meldung by ID ───────────────────────────────────

export const getMessageById = async (id, userId) => {
  const msg = await UserMessage.findById(id).lean();
  if (!msg) throw new AppError("Message not found", 404);
  // User darf nur eigene Meldungen sehen
  if (msg.authorId.toString() !== userId.toString()) {
    throw new AppError("Not authorized to view this message", 403);
  }
  return msg;
};

// ─── CREATE neue Meldung + Sync in users.messages[] ──────────────

export const createMessage = async (userId, data) => {
  // Author-Nickname aus User holen
  const user = await User.findById(userId).select("nickname").lean();
  if (!user) throw new AppError("User not found", 404);

  const msg = await UserMessage.create({
    ...data,
    authorId: userId,
    authorNickname: user.nickname,
    submissionStatus: "pending",
  });

  // Denormalisierte Summary im User-Dokument speichern
  const summary = buildSummary(msg);
  await User.findByIdAndUpdate(userId, {
    $push: { messages: { $each: [summary], $position: 0 } },
  });

  return msg;
};

// ─── UPDATE Submission Status ─────────────────────────────────────

export const updateSubmissionStatus = async (id, userId, submissionStatus) => {
  const msg = await UserMessage.findOneAndUpdate(
    { _id: id, authorId: userId },
    { submissionStatus },
    { new: true, runValidators: true }
  ).lean();

  if (!msg) throw new AppError("Message not found or not authorized", 404);

  // Sync: Summary im User-Dokument updaten
  await User.updateOne(
    { _id: userId, "messages.id": id },
    {
      $set: {
        "messages.$.submissionStatus": submissionStatus,
        "messages.$.updatedAt": new Date(),
      },
    }
  );

  return msg;
};

// ─── DELETE Meldung ───────────────────────────────────────────────

export const deleteMessage = async (id, userId) => {
  const msg = await UserMessage.findOneAndDelete({ _id: id, authorId: userId });
  if (!msg) throw new AppError("Message not found or not authorized", 404);

  // Aus users.messages[] entfernen
  await User.findByIdAndUpdate(userId, {
    $pull: { messages: { id: id } },
  });
};

// ─── GET alle Meldungen zu einem Barcode (Moderation/Admin) ───────

export const getMessagesByBarcode = async (barcode) => {
  return UserMessage.find({ "productSnapshot.barcode": barcode })
    .sort({ createdAt: -1 })
    .lean();
};
