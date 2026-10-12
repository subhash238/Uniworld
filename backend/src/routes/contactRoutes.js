const express = require("express");
const { createInquiry, getInquiries, markAsRead, deleteInquiry } = require("../controllers/contactController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Public
router.post("/", createInquiry);

// Admin
router.get("/", authMiddleware, getInquiries);
router.patch("/:id/read", authMiddleware, markAsRead);
router.delete("/:id", authMiddleware, deleteInquiry);

module.exports = router;
