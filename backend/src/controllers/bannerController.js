const prisma = require("../config/db");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");
const { imageSize } = require("image-size");

const validateBannerImage = (file, res) => {
  try {
    const { width, height } = imageSize(file.buffer);
    if (width !== 1900 || height !== 568) {
      res.status(400).json({
        message: `Banner image must be exactly 1900 x 568 px. Uploaded image is ${width} x ${height} px.`,
      });
      return false;
    }
    return true;
  } catch {
    res.status(400).json({ message: "Could not read image dimensions. Upload a valid image file." });
    return false;
  }
};

const createBanner = async (req, res) => {
  try {
    const { title, subtitle, link, isActive, order } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Banner image is required" });
    }
    if (!validateBannerImage(req.file, res)) return;

    const result = await uploadToCloudinary(req.file.buffer, "uniworld/banners");

    const banner = await prisma.banner.create({
      data: {
        title,
        subtitle,
        image: result.secure_url,
        publicId: result.public_id,
        link,
        isActive: isActive !== "false",
        order: parseInt(order) || 0,
      },
    });

    res.status(201).json({ message: "Banner created", banner });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getBanners = async (req, res) => {
  try {
    const banners = await prisma.banner.findMany({ orderBy: { order: "asc" } });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getActiveBanners = async (req, res) => {
  try {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateBanner = async (req, res) => {
  try {
    const { title, subtitle, link, isActive, order } = req.body;
    const data = {};

    if (req.file && !validateBannerImage(req.file, res)) return;

    if (title) data.title = title;
    if (subtitle !== undefined) data.subtitle = subtitle;
    if (link !== undefined) data.link = link;
    if (isActive !== undefined) data.isActive = isActive !== "false";
    if (order !== undefined) data.order = parseInt(order);

    if (req.file) {
      const existing = await prisma.banner.findUnique({ where: { id: req.params.id } });
      if (existing) await deleteFromCloudinary(existing.publicId);

      const result = await uploadToCloudinary(req.file.buffer, "uniworld/banners");
      data.image = result.secure_url;
      data.publicId = result.public_id;
    }

    const banner = await prisma.banner.update({ where: { id: req.params.id }, data });
    res.json({ message: "Banner updated", banner });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const banner = await prisma.banner.findUnique({ where: { id: req.params.id } });
    if (banner) await deleteFromCloudinary(banner.publicId);

    await prisma.banner.delete({ where: { id: req.params.id } });
    res.json({ message: "Banner deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createBanner, getBanners, getActiveBanners, updateBanner, deleteBanner };
