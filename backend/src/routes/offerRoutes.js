const express = require("express");
const {
  getPublicOffers,
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer,
} = require("../controllers/offerController");
const authMiddleware = require("../middleware/auth");
const { upload } = require("../middleware/upload");

const router = express.Router();

// Public routes
router.get("/public", getPublicOffers);

// Admin routes
router.get("/", authMiddleware, getOffers);
router.post("/", authMiddleware, upload.single("image"), createOffer);
router.put("/:id", authMiddleware, upload.single("image"), updateOffer);
router.delete("/:id", authMiddleware, deleteOffer);

module.exports = router;

