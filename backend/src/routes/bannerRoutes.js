const express = require("express");
const { createBanner, getBanners, getActiveBanners, updateBanner, deleteBanner } = require("../controllers/bannerController");
const authMiddleware = require("../middleware/auth");
const { upload } = require("../middleware/upload");

const router = express.Router();

// Public
router.get("/public", getActiveBanners);

// Admin
router.get("/", authMiddleware, getBanners);
router.post("/", authMiddleware, upload.single("image"), createBanner);
router.put("/:id", authMiddleware, upload.single("image"), updateBanner);
router.delete("/:id", authMiddleware, deleteBanner);

module.exports = router;
