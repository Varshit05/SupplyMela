import express from "express";
import protect from "../middleware/authmiddleWare.js";
import upload from "../middleware/upload.js";

import {
  getProfile,
  updateProfile,
  getAllVendors,
  getVendorById,
  uploadVendorDocument,
} from "../controllers/vendorController.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, upload.any(), updateProfile);

router.post(
  "/upload-document",
  protect,
  upload.single("file"),
  uploadVendorDocument
);

router.get("/", getAllVendors);
router.get("/:id", getVendorById);

export default router;