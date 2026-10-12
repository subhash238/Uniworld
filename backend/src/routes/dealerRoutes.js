const express = require("express");
const { createDealer, getDealers, getActiveDealers, updateDealer, deleteDealer } = require("../controllers/dealerController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Public
router.get("/public", getActiveDealers);

// Admin
router.get("/", authMiddleware, getDealers);
router.post("/", authMiddleware, createDealer);
router.put("/:id", authMiddleware, updateDealer);
router.delete("/:id", authMiddleware, deleteDealer);

module.exports = router;
