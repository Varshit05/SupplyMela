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
  gstNumber: String,
  panNumber: String,
  cin: String,

  businessStartYear: Number,
  annualRevenue: Number,
  phone: String,
  altPhone: String,
  spocName: String,
  entityType: String,
  promoterNames: String,

  address: {
    street: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" },
  },

  bankDetails: {
    accountNumber: { type: String, default: "" },
    ifsc: { type: String, default: "" },
  },

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
    default: 0
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
