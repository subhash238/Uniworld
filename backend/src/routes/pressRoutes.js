const express = require("express");
const {
  getPublicPressItems,
  getPressItems,
  createPressItem,
  updatePressItem,
  deletePressItem,
} = require("../controllers/pressController");
const authMiddleware = require("../middleware/auth");
const { upload } = require("../middleware/upload");

const router = express.Router();

router.get("/public", getPublicPressItems);
router.get("/", authMiddleware, getPressItems);
router.post("/", authMiddleware, upload.single("image"), createPressItem);
router.put("/:id", authMiddleware, upload.single("image"), updatePressItem);
router.delete("/:id", authMiddleware, deletePressItem);

module.exports = router;