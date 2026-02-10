import express from "express";
import { registerVendor, loginVendor, adminLogin, googleLogin} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerVendor);
router.post("/login", loginVendor);
router.post("/admin/login", adminLogin);
router.post("/google-login", googleLogin);

export default router;