export const sendSuccess = (
  res,
  data = null,
  message = "Success",
  statusCode = 200
) => {
  res.status(statusCode).json({
    success: true,
    status: statusCode,
    message,
    data,
  });
};

export const sendCreated = (
  res,
  data = null,
  message = "Created successfully"
) => {
  sendSuccess(res, data, message, 201);
};

export const sendNoContent = (res) => {
  res.status(204).send();
};
