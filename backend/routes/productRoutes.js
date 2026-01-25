import express from "express";
import protect from "../middleware/authmiddleWare.js";
import upload from "../middleware/upload.js";
import Product from "../models/product.js";
import { createProduct, updateProduct } from "../controllers/productController.js";

const router = express.Router();

/* CREATE */
router.post(
  "/",
  protect,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "catalogue", maxCount: 1 },
  ]),
  createProduct
);


/* READ (vendor products) */
router.get("/", protect, async (req, res) => {
  const products = await Product.find({ vendor: req.user.id });
  res.json(products);
});

/* UPDATE */
router.put(
  "/:id",
  protect,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "catalogue", maxCount: 1 },
  ]),
  updateProduct
);

router.get("/:id", protect, async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
});

/* DELETE */
router.delete("/:id", protect, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

export default router;
