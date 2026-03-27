import { Router } from "express";
import { getProduct } from "./product.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/:barcode", protect, getProduct);

export default router;