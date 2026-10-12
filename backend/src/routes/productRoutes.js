const express = require("express");
const { createProduct, getProducts, getPublicProducts, getProductBySlug, updateProduct, addProductImages, deleteProductImage, deleteProduct, uploadDatasheet, deleteDatasheet } = require("../controllers/productController");
const authMiddleware = require("../middleware/auth");
const { upload, uploadPdf } = require("../middleware/upload");

const router = express.Router();

// Public routes
router.get("/public", getPublicProducts);
router.get("/public/:slug", getProductBySlug);

// Admin routes
router.get("/", authMiddleware, getProducts);
router.post("/", authMiddleware, upload.array("images", 5), createProduct);
router.put("/:id", authMiddleware, updateProduct);
router.post("/:id/images", authMiddleware, upload.array("images", 5), addProductImages);
router.delete("/:id/images/:imageId", authMiddleware, deleteProductImage);
router.post("/:id/datasheet", authMiddleware, uploadPdf.single("datasheet"), uploadDatasheet);
router.delete("/:id/datasheet", authMiddleware, deleteDatasheet);
router.delete("/:id", authMiddleware, deleteProduct);

module.exports = router;
