import ScanHistory from "./scanHistory.model.js";
import { AppError } from "../../utils/appError.util.js";

// ─── GET alle Scan-History eines Users ───────────────────────────

export const getScanHistoryByUser = async (userId) => {
    const history = await ScanHistory.find({ userId })
        .sort({ scannedAt: -1 })
        .lean();

    return history;
};

// ─── GET einzelne History per ID ─────────────────────────────────

export const getScanHistoryById = async (id) => {
    const item = await ScanHistory.findById(id).lean();

    if (!item) {
        throw new AppError("Scan history entry not found", 404);
    }

    return item;
};

// ─── CREATE ──────────────────────────────────────────────────────

export const createScanHistory = async (data) => {
    const entry = await ScanHistory.create(data);
    return entry;
};

// ─── UPDATE ──────────────────────────────────────────────────────

export const updateScanHistory = async (id, data) => {
    const entry = await ScanHistory.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    }).lean();

    if (!entry) {
        throw new AppError("Scan history entry not found", 404);
    }

    return entry;
};

// ─── DELETE ──────────────────────────────────────────────────────

export const deleteScanHistory = async (id) => {
    const entry = await ScanHistory.findByIdAndDelete(id);

    if (!entry) {
        throw new AppError("Scan history entry not found", 404);
    }
};

// ─── DELETE alle Einträge eines Users ────────────────────────────

export const deleteAllScanHistoryByUser = async (userId) => {
    await ScanHistory.deleteMany({ userId });
};