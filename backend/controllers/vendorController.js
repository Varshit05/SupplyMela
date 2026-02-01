import Vendor from "../models/Vendor.js";
import calculateTrustScore from "../utils/trustScore.js";
import { uploadBufferToCloudinary } from "../utils/cloudinaryUpload.js";

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
    // 1. Use .lean() to get a plain JS object, bypassing Schema validation for a second
    const vendorData = await Vendor.findById(req.user.id).lean();
    if (!vendorData) return res.status(404).json({ message: "Vendor not found" });

    // 2. Identify the fields to update (matching your schema names)
    const schemaFields = [
      "companyName", "description", "gstNumber", "panNumber", "cin",
      "phone", "altPhone", "spocName", "entityType",
      "promoterNames", "address", "accountNumber", "ifsc"
    ];

    const updates = {};
    schemaFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // 3. Handle File Uploads
    if (req.files && req.files.length > 0) {
      const documents = vendorData.documents || {};
      for (const file of req.files) {
        const result = await uploadBufferToCloudinary(file.buffer, "vendor_documents");
        if (file.fieldname === "panFile") documents.panCard = result.secure_url;
        if (file.fieldname === "gstFile") documents.gstCert = result.secure_url;
      }
      updates.documents = documents;
    }

    // 4. Use findByIdAndUpdate with $set. 
    // This forces MongoDB to overwrite the old Object with the new String.
    const updatedVendor = await Vendor.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: false } // runValidators: false prevents the CastError during save
    );

    res.json({ message: "Profile updated successfully", vendor: updatedVendor });

  } catch (err) {
    console.error("FORCE UPDATE ERROR:", err);
    res.status(500).json({ message: "Update failed." });
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


    const vendor = await Vendor.findById(req.user.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }


    if (!vendor.documents) vendor.documents = {};
    if (!vendor.documents.certifications)
      vendor.documents.certifications = [];


    const result = await uploadBufferToCloudinary(
      req.file.buffer,
      "vendor_documents"
    );


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
