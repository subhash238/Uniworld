const express = require("express");
const { createProduct, getProducts, getPublicProducts, getProductBySlug, updateProduct, addProductImages, deleteProductImage, setPrimaryImage, deleteProduct, uploadDatasheet, deleteDatasheet } = require("../controllers/productController");
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
router.put("/:id/images/:imageId/primary", authMiddleware, setPrimaryImage);
router.post("/:id/datasheet", authMiddleware, uploadPdf.single("datasheet"), uploadDatasheet);
router.delete("/:id/datasheet", authMiddleware, deleteDatasheet);
router.delete("/:id", authMiddleware, deleteProduct);

module.exports = router;
