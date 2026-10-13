const prisma = require("../config/db");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");

const DOWNLOAD_TYPES = [
  "firmware",
  "software",
  "software-datasheet",
  "user-manual",
  "certificate",
  "sira-certificate",
];

const orderBy = [{ section: "asc" }, { order: "asc" }, { createdAt: "desc" }];

const text = (value) => (typeof value === "string" ? value.trim() : "");

const uploadFile = (file) =>
  uploadToCloudinary(file.buffer, "uniworld/downloads", "raw", {
    use_filename: true,
    unique_filename: true,
    filename_override: file.originalname,
  });

const removeFile = (publicId) => deleteFromCloudinary(publicId, "raw").catch(() => {});

const getPublicDownloads = async (req, res) => {
  try {
    const type = text(req.query.type);
    const items = await prisma.supportDownload.findMany({
      where: { isActive: true, ...(type ? { type } : {}) },
      select: { id: true, title: true, type: true, section: true, fileUrl: true, fileName: true, fileSize: true },
      orderBy,
    });
    res.json(items);
  } catch (error) {
    console.error("getPublicDownloads:", error);
    res.status(500).json({ message: "Failed to load downloads" });
  }
};

const getDownloads = async (req, res) => {
  try {
    const items = await prisma.supportDownload.findMany({ orderBy: [{ type: "asc" }, ...orderBy] });
    res.json(items);
  } catch (error) {
    console.error("getPublicDownloads:", error);
    res.status(500).json({ message: "Failed to load downloads" });
  }
};

const createDownload = async (req, res) => {
  let uploadedPublicId;
  try {
    const title = text(req.body.title);
    const type = text(req.body.type);
    const section = text(req.body.section);
    const order = Number.parseInt(req.body.order, 10);

    if (!title) return res.status(400).json({ message: "Title is required" });
    if (!DOWNLOAD_TYPES.includes(type)) return res.status(400).json({ message: "Choose a valid download type" });
    if (!section) return res.status(400).json({ message: "Section is required" });
    if (!req.file) return res.status(400).json({ message: "File is required" });

    const upload = await uploadFile(req.file);
    uploadedPublicId = upload.public_id;

    const item = await prisma.supportDownload.create({
      data: {
        title,
        type,
        section,
        fileUrl: upload.secure_url,
        publicId: upload.public_id,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        isActive: req.body.isActive !== "false",
        order: Number.isNaN(order) ? 0 : order,
      },
    });

    res.status(201).json({ message: "Download created", item });
  } catch (error) {
    if (uploadedPublicId) await removeFile(uploadedPublicId);
    console.error("createDownload:", error);
    res.status(500).json({ message: "Failed to create download" });
  }
};

const updateDownload = async (req, res) => {
  let uploadedPublicId;
  try {
    const existing = await prisma.supportDownload.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ message: "Download not found" });

    const data = {};
    if (req.body.title !== undefined) {
      const title = text(req.body.title);
      if (!title) return res.status(400).json({ message: "Title is required" });
      data.title = title;
    }
    if (req.body.type !== undefined) {
      const type = text(req.body.type);
      if (!DOWNLOAD_TYPES.includes(type)) return res.status(400).json({ message: "Choose a valid download type" });
      data.type = type;
    }
    if (req.body.section !== undefined) {
      const section = text(req.body.section);
      if (!section) return res.status(400).json({ message: "Section is required" });
      data.section = section;
    }
    if (req.body.isActive !== undefined) data.isActive = req.body.isActive !== "false";
    if (req.body.order !== undefined) {
      const order = Number.parseInt(req.body.order, 10);
      if (Number.isNaN(order)) return res.status(400).json({ message: "Order must be a number" });
      data.order = order;
    }

    if (req.file) {
      const upload = await uploadFile(req.file);
      uploadedPublicId = upload.public_id;
      data.fileUrl = upload.secure_url;
      data.publicId = upload.public_id;
      data.fileName = req.file.originalname;
      data.fileSize = req.file.size;
    }

    const item = await prisma.supportDownload.update({ where: { id: existing.id }, data });
    if (uploadedPublicId) await removeFile(existing.publicId);

    res.json({ message: "Download updated", item });
  } catch (error) {
    if (uploadedPublicId) await removeFile(uploadedPublicId);
    console.error("updateDownload:", error);
    res.status(500).json({ message: "Failed to update download" });
  }
};

const deleteDownload = async (req, res) => {
  try {
    const item = await prisma.supportDownload.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ message: "Download not found" });

    await prisma.supportDownload.delete({ where: { id: item.id } });
    await removeFile(item.publicId);
    res.json({ message: "Download deleted" });
  } catch (error) {
    console.error("deleteDownload:", error);
    res.status(500).json({ message: "Failed to delete download" });
  }
};

module.exports = {
  getPublicDownloads,
  getDownloads,
  createDownload,
  updateDownload,
  deleteDownload,
};
