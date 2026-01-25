import express from "express";
import { registerVendor, loginVendor } from "../controllers/authController.js";
import { adminLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerVendor);
console.log("Auth route loaded");
router.post("/login", loginVendor);
router.post("/admin/login", adminLogin);

export default router;