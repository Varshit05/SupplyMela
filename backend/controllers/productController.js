import Product from "../models/product.js";
import {v2 as cloudinary} from "cloudinary";
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
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 1. Update basic text fields (Name, Price, etc.)
    Object.assign(product, req.body);

    // 2. Handle Deletions from Cloudinary and Database
    if (req.body.deletedImages) {
      try {
        const toDeleteUrls = JSON.parse(req.body.deletedImages);

        for (const url of toDeleteUrls) {
          // Extract Public ID from URL
          // Example: .../products/images/xyz123.jpg -> products/images/xyz123
          const parts = url.split("/");
          const fileName = parts[parts.length - 1].split(".")[0];
          const folderPath = parts[parts.length - 3] + "/" + parts[parts.length - 2];
          const publicId = `${folderPath}/${fileName}`;

          // Delete from Cloudinary storage
          await cloudinary.uploader.destroy(publicId);
        }

        // Remove these URLs from the product's images array in DB
        product.images = product.images.filter(
          (img) => !toDeleteUrls.includes(img)
        );
      } catch (e) {
        console.error("Error processing deletions:", e);
      }
    }

    // 3. Handle New Image Uploads (Appending)
    if (req.files?.images) {
      // Note: We do NOT clear the array anymore
      for (const file of req.files.images) {
        const result = await uploadBufferToCloudinary(
          file.buffer,
          "products/images"
        );
        product.images.push(result.secure_url);
      }
    }

    // 4. Handle Catalogue Replacement (PDF)
    if (req.files?.catalogue) {
      // If an old catalogue exists, you might want to delete it from Cloudinary too
      if (product.catalogue) {
        const catParts = product.catalogue.split("/");
        const catFileName = catParts[catParts.length - 1].split(".")[0];
        const catPublicId = `products/catalogues/${catFileName}`;
        await cloudinary.uploader.destroy(catPublicId);
      }

      const result = await uploadBufferToCloudinary(
        req.files.catalogue[0].buffer,
        "products/catalogues"
      );
      product.catalogue = result.secure_url;
    }

    // 5. Save changes to MongoDB
    await product.save();

    res.json(product);
  } catch (err) {
    console.error("PRODUCT UPDATE ERROR:", err);
    res.status(500).json({ message: "Product update failed" });
  }
};