const express = require("express");
const {
  getPublicGalleryItems,
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} = require("../controllers/galleryController");
const authMiddleware = require("../middleware/auth");
const { uploadGallery } = require("../middleware/upload");

const router = express.Router();

router.get("/public", getPublicGalleryItems);
router.get("/", authMiddleware, getGalleryItems);
router.post("/", authMiddleware, uploadGallery.single("file"), createGalleryItem);
router.put("/:id", authMiddleware, uploadGallery.single("file"), updateGalleryItem);
router.delete("/:id", authMiddleware, deleteGalleryItem);

module.exports = router;
