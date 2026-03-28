import * as UserMessageService from "./userMessages.service.js";
import asyncHandler from "../../utils/asyncHandler.util.js";
import { sendSuccess, sendCreated, sendNoContent } from "../../utils/response.util.js";

// GET /api/v1/user-messages
export const getMyMessages = asyncHandler(async (req, res) => {
  const messages = await UserMessageService.getMyMessages(req.user.id);
  sendSuccess(res, messages);
});

// GET /api/v1/user-messages/:id
export const getMessageById = asyncHandler(async (req, res) => {
  const msg = await UserMessageService.getMessageById(req.params.id, req.user.id);
  sendSuccess(res, msg);
});

// POST /api/v1/user-messages
export const createMessage = asyncHandler(async (req, res) => {
  const msg = await UserMessageService.createMessage(req.user.id, req.body);
  sendCreated(res, msg, "Message submitted successfully");
});

// PATCH /api/v1/user-messages/:id/status
export const updateSubmissionStatus = asyncHandler(async (req, res) => {
  const { submissionStatus } = req.body;
  const msg = await UserMessageService.updateSubmissionStatus(
    req.params.id,
    req.user.id,
    submissionStatus
  );
  sendSuccess(res, msg, "Status updated successfully");
});

// DELETE /api/v1/user-messages/:id
export const deleteMessage = asyncHandler(async (req, res) => {
  await UserMessageService.deleteMessage(req.params.id, req.user.id);
  sendNoContent(res);
});

// GET /api/v1/user-messages/barcode/:barcode  (Admin/Moderation)
export const getMessagesByBarcode = asyncHandler(async (req, res) => {
  const messages = await UserMessageService.getMessagesByBarcode(req.params.barcode);
  sendSuccess(res, messages);
});