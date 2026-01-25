import Product from "../models/product.js";
import { cloudinary } from "../config/cloudinary.js";
import fs from "fs-extra";

/* CREATE PRODUCT */
export const createProduct = async (req, res) => {
  try {
    const images = [];
    let catalogue = "";

    // 🔹 Upload images to Cloudinary
    if (req.files?.images) {
      for (const file of req.files.images) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products/images",
        });
        images.push(result.secure_url);
        await fs.remove(file.path); // delete local file
      }
    }

    // 🔹 Upload catalogue (PDF)
    if (req.files?.catalogue) {
      const result = await cloudinary.uploader.upload(
        req.files.catalogue[0].path,
        {
          folder: "products/catalogues",
          resource_type: "auto",
          flags: "attachment:false",
        }
      );
      catalogue = result.secure_url;
      await fs.remove(req.files.catalogue[0].path);
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

/* UPDATE PRODUCT */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    Object.assign(product, req.body);

    // 🔹 Replace images if new ones uploaded
    if (req.files?.images) {
      product.images = [];
      for (const file of req.files.images) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products/images",
        });
        product.images.push(result.secure_url);
        await fs.remove(file.path);
      }
    }

    // 🔹 Replace catalogue if uploaded
    if (req.files?.catalogue) {
      const result = await cloudinary.uploader.upload(
        req.files.catalogue[0].path,
        {
          folder: "products/catalogues",
          resource_type: "auto",
          flags: "attachment:false",
        }
      );
      product.catalogue = result.secure_url;
      await fs.remove(req.files.catalogue[0].path);
    }

    await product.save();
    res.json(product);
  } catch (err) {
    console.error("PRODUCT UPDATE ERROR:", err);
    res.status(500).json({ message: "Product update failed" });
  }
};
