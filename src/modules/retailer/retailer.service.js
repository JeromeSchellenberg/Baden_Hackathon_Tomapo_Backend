import Retailer from "./retailer.model.js";
import { AppError } from "../../utils/appError.util.js";

export const getAllRetailers = async () => {
    return Retailer.find().select("-refreshToken").lean();
};

export const getRetailerById = async (id) => {
    const retailer = await Retailer.findById(id).select("-refreshToken").lean();

    if (!retailer) {
        throw new AppError("Retailer not found", 404);
    }

    return retailer;
};

export const createRetailer = async (data) => {
    const existingRetailer = await Retailer.findOne({ email: data.email });

    if (existingRetailer) {
        throw new AppError("A retailer with this email already exists", 409);
    }

    const retailer = await Retailer.create(data);

    return {
        id: retailer._id,
        companyName: retailer.companyName,
        email: retailer.email,
        logoUrl: retailer.logoUrl,
        createdAt: retailer.createdAt,
        updatedAt: retailer.updatedAt,
    };
};

export const updateRetailer = async (id, data) => {
    const retailer = await Retailer.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    })
        .select("-refreshToken")
        .lean();

    if (!retailer) {
        throw new AppError("Retailer not found", 404);
    }

    return retailer;
};

export const deleteRetailer = async (id) => {
    const retailer = await Retailer.findByIdAndDelete(id);

    if (!retailer) {
        throw new AppError("Retailer not found", 404);
    }
};