const express = require("express");
const { createSubCategory, getSubCategories, getSubCategoriesByCategory, updateSubCategory, deleteSubCategory } = require("../controllers/subCategoryController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/public/by-category/:categoryId", getSubCategoriesByCategory);

// Admin routes
router.get("/", authMiddleware, getSubCategories);
router.post("/", authMiddleware, createSubCategory);
router.put("/:id", authMiddleware, updateSubCategory);
router.delete("/:id", authMiddleware, deleteSubCategory);

module.exports = router;
