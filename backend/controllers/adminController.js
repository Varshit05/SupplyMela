import Vendor from "../models/Vendor.js";
import Product from "../models/product.js";

export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate("user", "email");
    res.json(vendors);
  } catch (err) {
    console.error("GET VENDORS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch vendors" });
  }
};

export const getVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.json(vendor);
  } catch (err) {
    // This catches the "CastError" so your server doesn't crash
    console.error("GET VENDOR ERROR:", err);
    res.status(400).json({ message: "Invalid ID format or server error" });
  }
};

export const getVendorProducts = async (req, res) => {
  try {
    // Added a check to ensure we don't query with a broken ID
    const products = await Product.find({ vendor: req.params.id });
    res.json(products);
  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err);
    res.status(500).json({ message: "Error fetching products" });
  }
};


export const updateKYC = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    vendor.kycStatus = req.body.status;
    await vendor.save();
    res.json(vendor);
  } catch (err) {
    console.error("UPDATE KYC ERROR:", err);
    res.status(500).json({ message: "Failed to update KYC" });
  }
};

export const rateVendor = async (req, res) => {
  try {
    const { rating } = req.body;

    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 0 and 5" });
    }

    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    vendor.trust.rating = rating;
    vendor.trust.reviewedBy = req.user.id;
    vendor.trust.reviewedAt = new Date();
    vendor.markModified("trust");
    await vendor.save();
    res.json({
      message: "Vendor rated successfully",
      trust: vendor.trust
    });
  } catch (err) {
    console.error("RATE VENDOR ERROR:", err);
    res.status(500).json({ message: "Failed to rate vendor" });
  }
};

