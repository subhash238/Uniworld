const prisma = require("../config/db");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");

const getPublicPressItems = async (req, res) => {
  try {
    const items = await prisma.pressItem.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to load press items" });
  }
};

const getPressItems = async (req, res) => {
  try {
    const items = await prisma.pressItem.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to load press items" });
  }
};

const normalizeLink = (value) => {
  const link = typeof value === "string" ? value.trim() : "";
  if (!link) return "";
  try {
    const parsed = new URL(link, process.env.CLIENT_URL || "http://localhost");
    return ["http:", "https:"].includes(parsed.protocol) ? link : null;
  } catch {
    return null;
  }
};

const createPressItem = async (req, res) => {
  let uploadedPublicId;
  try {
    const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
    const link = normalizeLink(req.body.link);
    const order = Number.parseInt(req.body.order, 10);

    if (!title) return res.status(400).json({ message: "Title is required" });
    if (!req.file) return res.status(400).json({ message: "Image is required" });
    if (link === null) return res.status(400).json({ message: "Link must use HTTP or HTTPS" });

    const upload = await uploadToCloudinary(req.file.buffer, "uniworld/press");
    uploadedPublicId = upload.public_id;

    const item = await prisma.pressItem.create({
      data: {
        title,
        description: req.body.description?.trim() || null,
        image: upload.secure_url,
        publicId: upload.public_id,
        link,
        isActive: req.body.isActive !== "false",
        order: Number.isNaN(order) ? 0 : order,
      },
    });

    res.status(201).json({ message: "Press item created", item });
  } catch (error) {
    if (uploadedPublicId) await deleteFromCloudinary(uploadedPublicId).catch(() => {});
    res.status(500).json({ message: "Failed to create press item" });
  }
};

const updatePressItem = async (req, res) => {
  let uploadedPublicId;
  try {
    const existing = await prisma.pressItem.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ message: "Press item not found" });

    const link = req.body.link === undefined ? undefined : normalizeLink(req.body.link);
    if (link === null) return res.status(400).json({ message: "Link must use HTTP or HTTPS" });

    const data = {};
    if (req.body.title !== undefined) {
      const title = req.body.title.trim();
      if (!title) return res.status(400).json({ message: "Title is required" });
      data.title = title;
    }
    if (req.body.description !== undefined) data.description = req.body.description.trim() || null;
    if (link !== undefined) data.link = link;
    if (req.body.isActive !== undefined) data.isActive = req.body.isActive !== "false";
    if (req.body.order !== undefined) {
      const order = Number.parseInt(req.body.order, 10);
      if (Number.isNaN(order)) return res.status(400).json({ message: "Order must be a number" });
      data.order = order;
    }

    if (req.file) {
      const upload = await uploadToCloudinary(req.file.buffer, "uniworld/press");
      uploadedPublicId = upload.public_id;
      data.image = upload.secure_url;
      data.publicId = upload.public_id;
    }

    const item = await prisma.pressItem.update({ where: { id: existing.id }, data });
    if (uploadedPublicId && existing.publicId) {
      await deleteFromCloudinary(existing.publicId).catch(() => {});
    }

    res.json({ message: "Press item updated", item });
  } catch (error) {
    if (uploadedPublicId) await deleteFromCloudinary(uploadedPublicId).catch(() => {});
    res.status(500).json({ message: "Failed to update press item" });
  }
};

const deletePressItem = async (req, res) => {
  try {
    const item = await prisma.pressItem.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ message: "Press item not found" });

    await prisma.pressItem.delete({ where: { id: item.id } });
    if (item.publicId) await deleteFromCloudinary(item.publicId).catch(() => {});
    res.json({ message: "Press item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete press item" });
  }
};

module.exports = {
  getPublicPressItems,
  getPressItems,
  createPressItem,
  updatePressItem,
  deletePressItem,
};