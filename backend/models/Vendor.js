import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  name: String,
  email: String,
  password: String,

  companyName: String,
  description: String,
  gstNumber: String,
  panNumber: String,
  cin: String,

  phone: String,
  altPhone: String,
  spocName: String,
  entityType: String,
  promoterNames: String,

  address: String,

  accountNumber: String,
  ifsc: String,

  documents: {
    gstCert: { type: String, default: "" },
    panCard: { type: String, default: "" },
    license: { type: String, default: "" },
    certifications: { type: [String], default: [] },
  },

  kycStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  trust: {
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
      // set: v => Math.round(v * 10) / 10 // Round to 1 decimal place
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    reviewedAt: {
      type: Date
    }
  },

  role: { type: String, default: "vendor" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Vendor", vendorSchema);
