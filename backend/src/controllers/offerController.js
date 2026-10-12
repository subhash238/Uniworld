const prisma = require("../config/db");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");

const parseBool = (value, defaultVal = true) => {
  if (value === undefined || value === null) return defaultVal;
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return defaultVal;
};

const getPublicOffers = async (req, res) => {
  try {
    const offers = await prisma.offerItem.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getOffers = async (req, res) => {
  try {
    const offers = await prisma.offerItem.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createOffer = async (req, res) => {
  try {
    const { title, description, link, buttonText, position, order, isActive } = req.body;

    let image = "";
    let publicId = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "uniworld/offers");
      image = result.secure_url;
      publicId = result.public_id;
    } else if (req.body.imageUrl) {
      image = req.body.imageUrl.trim();
    } else {
      return res.status(400).json({ message: "Offer image poster is required" });
    }

    const offerTitle = title && title.trim() ? title.trim() : (position === "featured" ? "Featured Offer" : "Offer Poster");

    const offer = await prisma.offerItem.create({
      data: {
        title: offerTitle,
        description: description ? description.trim() : null,
        image,
        publicId,
        link: link ? link.trim() : null,
        buttonText: buttonText ? buttonText.trim() : null,
        position: position === "featured" ? "featured" : "grid",
        order: parseInt(order, 10) || 0,
        isActive: parseBool(isActive, true),
      },
    });

    res.status(201).json({ message: "Offer created successfully", offer });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateOffer = async (req, res) => {
  try {
    const existing = await prisma.offerItem.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return res.status(404).json({ message: "Offer not found" });
    }

    const { title, description, link, buttonText, position, order, isActive } = req.body;
    const data = {};

    if (title !== undefined) data.title = title.trim();
    if (description !== undefined) data.description = description ? description.trim() : null;
    if (link !== undefined) data.link = link ? link.trim() : null;
    if (buttonText !== undefined) data.buttonText = buttonText ? buttonText.trim() : "View More";
    if (position !== undefined) data.position = position === "featured" ? "featured" : "grid";
    if (order !== undefined) data.order = parseInt(order, 10) || 0;
    if (isActive !== undefined) data.isActive = parseBool(isActive, existing.isActive);

    if (req.file) {
      if (existing.publicId) {
        await deleteFromCloudinary(existing.publicId).catch(() => {});
      }
      const result = await uploadToCloudinary(req.file.buffer, "uniworld/offers");
      data.image = result.secure_url;
      data.publicId = result.public_id;
    } else if (req.body.imageUrl && req.body.imageUrl.trim()) {
      data.image = req.body.imageUrl.trim();
    }

    const offer = await prisma.offerItem.update({
      where: { id: req.params.id },
      data,
    });

    res.json({ message: "Offer updated successfully", offer });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteOffer = async (req, res) => {
  try {
    const existing = await prisma.offerItem.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return res.status(404).json({ message: "Offer not found" });
    }

    if (existing.publicId) {
      await deleteFromCloudinary(existing.publicId).catch(() => {});
    }

    await prisma.offerItem.delete({ where: { id: req.params.id } });
    res.json({ message: "Offer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getPublicOffers,
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer,
};

