const prisma = require("../config/db");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");

const orderBy = [{ order: "asc" }, { createdAt: "desc" }];
const text = (value) => (typeof value === "string" ? value.trim() : "");
const mediaTypeOf = (file) => (file.mimetype.startsWith("video/") ? "video" : "image");
const removeFile = (publicId, mediaType) =>
  deleteFromCloudinary(publicId, mediaType === "video" ? "video" : "image").catch(() => {});

const getPublicGalleryItems = async (req, res) => {
  try {
    const items = await prisma.galleryItem.findMany({
      where: { isActive: true },
      select: { id: true, title: true, mediaType: true, fileUrl: true },
      orderBy,
    });
    res.json(items);
  } catch (error) {
    console.error("getPublicGalleryItems:", error);
    res.status(500).json({ message: "Failed to load gallery items" });
  }
};

const getGalleryItems = async (req, res) => {
  try {
    const items = await prisma.galleryItem.findMany({ orderBy });
    res.json(items);
  } catch (error) {
    console.error("getGalleryItems:", error);
    res.status(500).json({ message: "Failed to load gallery items" });
  }
};

const createGalleryItem = async (req, res) => {
  let uploaded;
  try {
    const title = text(req.body.title);
    const order = Number.parseInt(req.body.order, 10);
    const mediaType = text(req.body.mediaType);

    if (!title) return res.status(400).json({ message: "Title is required" });
    if (!req.file) return res.status(400).json({ message: "Image or video file is required" });
    if (mediaType && !["image", "video"].includes(mediaType)) {
      return res.status(400).json({ message: "Media type must be image or video" });
    }
    const effectiveMediaType = mediaType || mediaTypeOf(req.file);
    if (effectiveMediaType === "image" !== req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ message: "Selected media type does not match the file" });
    }

    uploaded = await uploadToCloudinary(
      req.file.buffer,
      "uniworld/gallery",
      effectiveMediaType,
      { use_filename: true, unique_filename: true, filename_override: req.file.originalname }
    );

    const item = await prisma.galleryItem.create({
      data: {
        title,
        mediaType: effectiveMediaType,
        fileUrl: uploaded.secure_url,
        publicId: uploaded.public_id,
        isActive: req.body.isActive !== "false",
        order: Number.isNaN(order) ? 0 : order,
      },
    });

    res.status(201).json({ message: "Gallery item created", item });
  } catch (error) {
    if (uploaded) await removeFile(uploaded.public_id, mediaTypeOf(req.file || { mimetype: "" }));
    console.error("createGalleryItem:", error);
    res.status(500).json({ message: "Failed to create gallery item" });
  }
};

const updateGalleryItem = async (req, res) => {
  let uploaded;
  try {
    const existing = await prisma.galleryItem.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ message: "Gallery item not found" });

    const data = {};
    if (req.body.title !== undefined) {
      const title = text(req.body.title);
      if (!title) return res.status(400).json({ message: "Title is required" });
      data.title = title;
    }
    if (req.body.isActive !== undefined) data.isActive = req.body.isActive !== "false";
    if (req.body.order !== undefined) {
      const order = Number.parseInt(req.body.order, 10);
      if (Number.isNaN(order)) return res.status(400).json({ message: "Order must be a number" });
      data.order = order;
    }

    if (req.file) {
      const mediaType = mediaTypeOf(req.file);
      uploaded = await uploadToCloudinary(req.file.buffer, "uniworld/gallery", mediaType, {
        use_filename: true,
        unique_filename: true,
        filename_override: req.file.originalname,
      });
      data.mediaType = mediaType;
      data.fileUrl = uploaded.secure_url;
      data.publicId = uploaded.public_id;
    }

    const item = await prisma.galleryItem.update({ where: { id: existing.id }, data });
    if (uploaded) await removeFile(existing.publicId, existing.mediaType);

    res.json({ message: "Gallery item updated", item });
  } catch (error) {
    if (uploaded) await removeFile(uploaded.public_id, mediaTypeOf(req.file || { mimetype: "" }));
    console.error("updateGalleryItem:", error);
    res.status(500).json({ message: "Failed to update gallery item" });
  }
};

const deleteGalleryItem = async (req, res) => {
  try {
    const item = await prisma.galleryItem.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ message: "Gallery item not found" });

    await prisma.galleryItem.delete({ where: { id: item.id } });
    await removeFile(item.publicId, item.mediaType);
    res.json({ message: "Gallery item deleted" });
  } catch (error) {
    console.error("deleteGalleryItem:", error);
    res.status(500).json({ message: "Failed to delete gallery item" });
  }
};

module.exports = {
  getPublicGalleryItems,
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};
