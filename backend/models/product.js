import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["product", "service"],
      required: true,
    },
    description: String,
    specifications: String,
    price: {
      type: Number,
      required: true,
    },
    images: [String],      // image URLs
    catalogue: String,     // PDF URL
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
