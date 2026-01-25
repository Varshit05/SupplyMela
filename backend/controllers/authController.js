import Vendor from "../models/Vendor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import calculateTrustScore from "../utils/trustScore.js";
import User from "../models/User.js";
const signToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      role: user.role,        // "admin" or "vendor"
      isAdmin: user.role === "admin"
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );


/* ==================  VENDOR AUTH  ================== */

export const registerVendor = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    // 1️⃣ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // 2️⃣ Hash password
    const hashed = await bcrypt.hash(password, 10);

    // 3️⃣ Create USER (auth identity)
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "vendor"
    });

    // 4️⃣ Create VENDOR (business profile)
    const vendor = await Vendor.create({
      ...req.body,
      password: hashed,     // optional (see note below)
      user: user._id,
      role: "vendor"
    });

    res.status(201).json({
      message: "Vendor registered successfully",
      vendorId: vendor._id
    });

  } catch (err) {
    console.error("🔥 REGISTER VENDOR ERROR:", err);

    if (err.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const vendor = await Vendor.findOne({ email });
    if (!vendor) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, vendor.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      token: signToken({_id : vendor._id, role: "vendor"}),
      role: "vendor",
      vendorId: vendor._id
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ==================  ADMIN LOGIN  ================== */

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // look for admin user ONLY
    const user = await User.findOne({ email, role: "admin" });

    if (!user) return res.status(400).json({ message: "Admin not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      token: signToken(user),
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
