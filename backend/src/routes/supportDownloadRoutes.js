const express = require("express");
const {
  getPublicDownloads,
  getDownloads,
  createDownload,
  updateDownload,
  deleteDownload,
} = require("../controllers/supportDownloadController");
const authMiddleware = require("../middleware/auth");
const { uploadDownload } = require("../middleware/upload");

const router = express.Router();

router.get("/public", getPublicDownloads);
router.get("/", authMiddleware, getDownloads);
router.post("/", authMiddleware, uploadDownload.single("file"), createDownload);
router.put("/:id", authMiddleware, uploadDownload.single("file"), updateDownload);
router.delete("/:id", authMiddleware, deleteDownload);

module.exports = router;
