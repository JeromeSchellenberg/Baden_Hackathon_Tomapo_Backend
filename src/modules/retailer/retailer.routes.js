import { Router } from "express";
import {
    getAllRetailers,
    getRetailerById,
    createRetailer,
    updateRetailer,
    deleteRetailer,
} from "./retailer.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", protect, getAllRetailers);
router.get("/:id", protect, getRetailerById);
router.post("/", protect, createRetailer);
router.patch("/:id", protect, updateRetailer);
router.delete("/:id", protect, deleteRetailer);

export default router;