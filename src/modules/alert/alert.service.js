import mongoose from "mongoose";
import Alert from "./alert.model.js";
import Trace from "../trace/trace.model.js";
import { AppError } from "../../utils/appError.util.js";

const ACTIVE_ALERT_FILTER = {
  $or: [
    { expiresAt: null },
    { expiresAt: { $gt: new Date() } },
  ],
};

const buildActiveQuery = (extra = {}) => ({
  ...extra,
  ...ACTIVE_ALERT_FILTER,
});

const syncAlertReferenceToTraces = async ({ alertId, barcode, batchId }) => {
  const filter = batchId
    ? { barcode, batchId }
    : { barcode };

  await Trace.updateMany(filter, {
    $addToSet: { alertIds: alertId },
  });
};

const removeAlertReferenceFromTraces = async ({ alertId, barcode, batchId }) => {
  const filter = batchId
    ? { barcode, batchId }
    : { barcode };

  await Trace.updateMany(filter, {
    $pull: { alertIds: alertId },
  });
};

// GET newest active alerts by barcode
export const getAlertsByBarcode = async (barcode, options = {}) => {
  const { includeExpired = false, includeResolved = true } = options;

  const query = { barcode };

  if (!includeResolved) {
    query.status = "active";
  }

  const finalQuery = includeExpired ? query : buildActiveQuery(query);

  const alerts = await Alert.find(finalQuery)
    .sort({ createdAt: -1 })
    .lean();

  return alerts;
};

// GET active alerts by barcode + batchId
export const getAlertsByBarcodeAndBatch = async (barcode, batchId, options = {}) => {
  const { includeExpired = false, includeResolved = true } = options;

  const query = { barcode, batchId };

  if (!includeResolved) {
    query.status = "active";
  }

  const finalQuery = includeExpired ? query : buildActiveQuery(query);

  const alerts = await Alert.find(finalQuery)
    .sort({ createdAt: -1 })
    .lean();

  return alerts;
};

// GET one alert
export const getAlertById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid alert id", 400);
  }

  const alert = await Alert.findById(id).lean();

  if (!alert) {
    throw new AppError("Alert not found", 404);
  }

  return alert;
};

// GET all retailer alerts (source === "retailer")
export const getOfficialAlerts = async (options = {}) => {
  const { includeExpired = false } = options;

  const query = { source: "official" };
  const finalQuery = includeExpired ? query : buildActiveQuery(query);

  return Alert.find(finalQuery)
    .sort({ createdAt: -1 })
    .lean();
};

// GET all community alerts (source === "community")
export const getCommunityAlerts = async (options = {}) => {
  const { includeExpired = false } = options;

  const query = { source: "community" };
  const finalQuery = includeExpired ? query : buildActiveQuery(query);

  return Alert.find(finalQuery)
    .sort({ createdAt: -1 })
    .lean();
};

// CREATE
export const createAlert = async (data) => {
  const alert = await Alert.create(data);

  await syncAlertReferenceToTraces({
    alertId: alert._id,
    barcode: alert.barcode,
    batchId: alert.batchId,
  });

  return alert.toObject();
};

// UPDATE
export const updateAlert = async (id, data) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid alert id", 400);
  }

  const existingAlert = await Alert.findById(id);
  if (!existingAlert) {
    throw new AppError("Alert not found", 404);
  }

  const oldBarcode = existingAlert.barcode;
  const oldBatchId = existingAlert.batchId;

  Object.assign(existingAlert, data);
  await existingAlert.save();

  const newBarcode = existingAlert.barcode;
  const newBatchId = existingAlert.batchId;

  const targetChanged =
    oldBarcode !== newBarcode ||
    String(oldBatchId ?? "") !== String(newBatchId ?? "");

  if (targetChanged) {
    await removeAlertReferenceFromTraces({
      alertId: existingAlert._id,
      barcode: oldBarcode,
      batchId: oldBatchId,
    });

    await syncAlertReferenceToTraces({
      alertId: existingAlert._id,
      barcode: newBarcode,
      batchId: newBatchId,
    });
  }

  return existingAlert.toObject();
};

// DELETE
export const deleteAlert = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid alert id", 400);
  }

  const alert = await Alert.findByIdAndDelete(id);

  if (!alert) {
    throw new AppError("Alert not found", 404);
  }

  await removeAlertReferenceFromTraces({
    alertId: alert._id,
    barcode: alert.barcode,
    batchId: alert.batchId,
  });
};

// CONFIRM
export const confirmAlert = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid alert id", 400);
  }

  const alert = await Alert.findByIdAndUpdate(
    id,
    { $inc: { confirmationCount: 1 } },
    { new: true, runValidators: true }
  ).lean();

  if (!alert) {
    throw new AppError("Alert not found", 404);
  }

  return alert;
};

// REJECT
export const rejectAlert = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid alert id", 400);
  }

  const alert = await Alert.findByIdAndUpdate(
    id,
    { $inc: { rejectionCount: 1 } },
    { new: true, runValidators: true }
  ).lean();

  if (!alert) {
    throw new AppError("Alert not found", 404);
  }

  return alert;
};