import Vendor from "../models/Vendor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import calculateTrustScore from "../utils/trustScore.js";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
const signAccessToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      role: user.role,        // "admin" or "vendor"
      isAdmin: user.role === "admin"
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // Short-lived access token
  );

const signRefreshToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.REFRESH_TOKEN_SECRET || "fallback_refresh_secret",
    { expiresIn: "7d" } // Longer-lived refresh token
  );

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: "Refresh token required" });

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "fallback_refresh_secret");
    
    // Find user in either model
    let user = await User.findById(decoded.id);
    if (!user) {
        user = await Vendor.findById(decoded.id);
    }
    
    if (!user) return res.status(403).json({ message: "User not found" });

    const newAccessToken = signAccessToken(user);

    res.json({
      token: newAccessToken,
      // We can also rotate the refresh token here if desired
    });
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

    const userObj = { _id: vendor._id, role: "vendor" };
    res.json({
      token: signAccessToken(userObj),
      refreshToken: signRefreshToken(userObj),
      role: "vendor",
      vendorId: vendor._id
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, sub: googleId, picture } = ticket.getPayload();

    // 1. Find or Create User
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        role: "vendor",
        googleId,
        password: Math.random().toString(36).slice(-16), // Dummy password for schema requirements
      });
    }

    // 2. Find or Create Vendor
    let vendor = await Vendor.findOne({ email });
    if (!vendor) {
      vendor = await Vendor.create({
        name,
        email,
        user: user._id,
        role: "vendor",
        // If your Vendor model requires a password, we must provide one
        password: user.password || Math.random().toString(36).slice(-16), 
      });
    }

    // 3. Generate the token
    const userObj = { _id: vendor._id, role: "vendor" };
    const appToken = signAccessToken(userObj);
    const refreshToken = signRefreshToken(userObj);

    res.json({
      token: appToken,
      refreshToken,
      role: "vendor",
      vendorId: vendor._id,
      user: { name: user.name, email: user.email, picture }
    });

  } catch (err) {
    console.error("🔥 GOOGLE LOGIN ERROR:", err);
    // Send the actual error message back during debugging to see what's wrong
    res.status(401).json({ message: "Google authentication failed", error: err.message });
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
      token: signAccessToken(user),
      refreshToken: signRefreshToken(user),
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
