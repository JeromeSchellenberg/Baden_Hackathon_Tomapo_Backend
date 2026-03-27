import * as UserService from "./user.service.js";
import asyncHandler from "../../utils/asyncHandler.util.js";
import { sendSuccess, sendNoContent } from "../../utils/response.util.js";

// GET /api/v1/users/me
export const getMe = asyncHandler(async (req, res) => {
  const user = await UserService.getMe(req.user.id);
  sendSuccess(res, user);
});

// PATCH /api/v1/users/me
export const updateMe = asyncHandler(async (req, res) => {
  const user = await UserService.updateMe(req.user.id, req.body);
  sendSuccess(res, user, "Profile updated successfully");
});

// PATCH /api/v1/users/me/avatar
export const updateAvatar = asyncHandler(async (req, res) => {
  const { avatarUrl } = req.body;
  const user = await UserService.updateAvatar(req.user.id, avatarUrl);
  sendSuccess(res, user, "Avatar updated successfully");
});

// DELETE /api/v1/users/me
export const deleteMe = asyncHandler(async (req, res) => {
  await UserService.deleteMe(req.user.id);
  sendNoContent(res);
});

// GET /api/v1/users/me/messages
export const getMyMessages = asyncHandler(async (req, res) => {
  const messages = await UserService.getMyMessages(req.user.id);
  sendSuccess(res, messages);
});

// GET /api/v1/users/:id  (Admin / intern)
export const getUserById = asyncHandler(async (req, res) => {
  const user = await UserService.getUserById(req.params.id);
  sendSuccess(res, user);
});
