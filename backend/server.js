import dotenv from "dotenv";
dotenv.config();

import { initCloudinary } from "./config/cloudinary.js";
initCloudinary();
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

connectDB();

const app = express();

app.use(cors({
origin: [
"http://localhost:5173",
"https://supply-mela.vercel.app",
"https://supplymela.com",
"https://www.supplymela.com"
],
methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);

/* TEST ROUTE */
app.get("/", (req, res) => {
  res.send("Vendor Portal API Running");
});

app.post("/test", (req, res) => {
  res.status(200).json({ ok: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
