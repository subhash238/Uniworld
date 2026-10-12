const express = require("express");
const { createOrder, getOrders, getOrderById, updateOrderStatus, deleteOrder } = require("../controllers/orderController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Public
router.post("/", createOrder);

// Admin
router.get("/", authMiddleware, getOrders);
router.get("/:id", authMiddleware, getOrderById);
router.patch("/:id/status", authMiddleware, updateOrderStatus);
router.delete("/:id", authMiddleware, deleteOrder);

module.exports = router;
