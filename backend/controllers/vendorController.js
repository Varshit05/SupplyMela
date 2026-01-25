import Vendor from "../models/Vendor.js";
import calculateTrustScore from "../utils/trustScore.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs-extra";

/* ================= PROFILE ================= */

export const getProfile = async (req, res) => {
  try {
    if (req.user.role !== "vendor") {
      return res.status(403).json({ message: "Access denied" });
    }

const vendor = await Vendor.findById(req.user.id).select("-password");

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.json(vendor);
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateProfile = async (req, res) => {
  try {
    // ✅ Correct vendor lookup
const vendor = await Vendor.findById(req.user.id);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // ✅ Ensure nested objects exist
    if (!vendor.address) vendor.address = {};
    if (!vendor.bankDetails) vendor.bankDetails = {};
    if (!vendor.documents) vendor.documents = {};

    /* ---------- STAGE 1 ---------- */
    if (req.body.entityName !== undefined)
      vendor.companyName = req.body.entityName;

    if (req.body.entityType !== undefined)
      vendor.entityType = req.body.entityType;

    if (req.body.promoterNames !== undefined)
      vendor.promoterNames = req.body.promoterNames;

    if (req.body.spocName !== undefined)
      vendor.spocName = req.body.spocName;

    if (req.body.phone !== undefined)
      vendor.phone = req.body.phone;

    if (req.body.altPhone !== undefined)
      vendor.altPhone = req.body.altPhone;

    if (req.body.registeredAddress !== undefined)
      vendor.address.street = req.body.registeredAddress;

    /* ---------- STAGE 2 ---------- */
    if (req.body.panNumber !== undefined)
      vendor.panNumber = req.body.panNumber;

    if (req.body.cin !== undefined)
      vendor.cin = req.body.cin;

    if (req.body.otherCerts !== undefined)
      vendor.otherCerts = req.body.otherCerts;

    /* ---------- STAGE 3 ---------- */
    if (req.body.bankAccount !== undefined)
      vendor.bankDetails.accountNumber = req.body.bankAccount;

    if (req.body.ifsc !== undefined)
      vendor.bankDetails.ifsc = req.body.ifsc;

  /* ---------- FILES ---------- */
if (req.files && req.files.length > 0) {
  for (const file of req.files) {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "vendor_documents",
      resource_type: "raw",
    });

    await fs.remove(file.path);

    if (file.fieldname === "panFile") {
      vendor.documents.panCard = result.secure_url;
    }

    if (file.fieldname === "gstFile") {
      vendor.documents.gstCert = result.secure_url;
    }

    if (file.fieldname === "licenseFile") {
      vendor.documents.license = result.secure_url;
    }
  }
}


    /* ---------- TRUST SCORE ---------- */
    vendor.trustScore = calculateTrustScore(vendor);

    await vendor.save();

    res.json({
      message: "Profile updated successfully",
      trustScore: vendor.trustScore,
    });

  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: "Profile update failed" });
  }
};


/* ================= ADMIN / PUBLIC ================= */

export const getAllVendors = async (req, res) => {
  const vendors = await Vendor.find().select("-password");
  res.json(vendors);
};

export const getVendorById = async (req, res) => {
  const vendor = await Vendor.findById(req.params.id).select("-password");
  if (!vendor) {
    return res.status(404).json({ message: "Vendor not found" });
  }
  res.json(vendor);
};


/* ================= DOCUMENT UPLOAD ================= */

export const uploadVendorDocument = async (req, res) => {
  try {
    const { type } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file received" });
    }

    // ✅ Correct vendor lookup
const vendor = await Vendor.findById(req.user.id);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    if (!vendor.documents) vendor.documents = {};
    if (!vendor.documents.certifications)
      vendor.documents.certifications = [];

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "vendor_documents",
      resource_type: "raw",
    });

    await fs.remove(req.file.path);

    if (type === "certification") {
      vendor.documents.certifications.push(result.secure_url);
    } else {
      vendor.documents[type] = result.secure_url;
    }

    vendor.trustScore = calculateTrustScore(vendor);
    vendor.kycStatus = "pending";

    await vendor.save();

    res.status(200).json({
      message: "Document uploaded successfully",
      documentUrl: result.secure_url,
      trustScore: vendor.trustScore,
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({
      message: "Document upload failed",
      error: error.message,
    });
  }
};
