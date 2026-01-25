import Product from "../models/product.js";
import { uploadBufferToCloudinary } from "../utils/cloudinaryUpload.js";

/* CREATE PRODUCT */
export const createProduct = async (req, res) => {
  try {
    const images = [];
    let catalogue = "";


    // 🔹 Upload images
    if (req.files?.images) {
      for (const file of req.files.images) {
        const result = await uploadBufferToCloudinary(
          file.buffer,
          "products/images"
        );
        images.push(result.secure_url);
      }
    }


    // 🔹 Upload catalogue (PDF)
    if (req.files?.catalogue) {
      const result = await uploadBufferToCloudinary(
        req.files.catalogue[0].buffer,
        "products/catalogues"
      );
      catalogue = result.secure_url;
    }


    const product = await Product.create({
      vendor: req.user.id,
      ...req.body,
      images,
      catalogue,
    });


    res.status(201).json(product);
  } catch (err) {
    console.error("PRODUCT CREATE ERROR:", err);
    res.status(500).json({ message: "Product creation failed" });
  }
};


/* =========================
UPDATE PRODUCT
========================= */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });


    Object.assign(product, req.body);


    // 🔹 Replace images if uploaded
    if (req.files?.images) {
      product.images = [];
      for (const file of req.files.images) {
        const result = await uploadBufferToCloudinary(
          file.buffer,
          "products/images"
        );
        product.images.push(result.secure_url);
      }
    }


    // 🔹 Replace catalogue if uploaded
    if (req.files?.catalogue) {
      const result = await uploadBufferToCloudinary(
        req.files.catalogue[0].buffer,
        "products/catalogues"
      );
      product.catalogue = result.secure_url;
    }


    await product.save();
    res.json(product);
  } catch (err) {
    console.error("PRODUCT UPDATE ERROR:", err);
    res.status(500).json({ message: "Product update failed" });
  }
};
