const express = require("express");
const { createCategory, getCategories, getActiveCategories, getCategoryBySlug, updateCategory, removeCategoryImage, deleteCategory } = require("../controllers/categoryController");
const authMiddleware = require("../middleware/auth");
const { upload } = require("../middleware/upload");

const router = express.Router();

// Public routes
router.get("/public", getActiveCategories);
router.get("/public/:slug", getCategoryBySlug);

// Admin routes
router.get("/", authMiddleware, getCategories);
router.post("/", authMiddleware, upload.single("image"), createCategory);
router.put("/:id", authMiddleware, upload.single("image"), updateCategory);
router.delete("/:id/image", authMiddleware, removeCategoryImage);
router.delete("/:id", authMiddleware, deleteCategory);

module.exports = router;
