import express from "express";
import protect from "../middleware/authmiddleWare.js";
import { adminOnly } from "../middleware/admin.js";
import {
  getVendors,
  getVendor,
  updateKYC,
  rateVendor
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get("/vendors", getVendors);
router.get("/vendors/:id", getVendor);
router.put("/vendors/:id/kyc", updateKYC);
router.put("/vendors/:id/rate", rateVendor);

export default router;
