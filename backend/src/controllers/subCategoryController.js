const prisma = require("../config/db");

const toSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const wouldCreateCycle = async (id, parentId) => {
  let cursor = parentId;
  const seen = new Set([id]);
  while (cursor) {
    if (seen.has(cursor)) return true;
    seen.add(cursor);
    const parent = await prisma.subCategory.findUnique({ where: { id: cursor }, select: { parentId: true } });
    cursor = parent?.parentId || null;
  }
  return false;
};

const createSubCategory = async (req, res) => {
  try {
    const { name, categoryId, isActive, parentId } = req.body;
    const slug = toSlug(name);

    if (parentId) {
      const parent = await prisma.subCategory.findUnique({ where: { id: parentId }, select: { categoryId: true } });
      if (!parent) return res.status(400).json({ message: "Parent sub-category not found" });
      if (parent.categoryId !== categoryId) {
        return res.status(400).json({ message: "Parent sub-category must belong to the same category" });
      }
    }

    const subCategory = await prisma.subCategory.create({
      data: { name, slug, categoryId, isActive: isActive !== "false", parentId: parentId || null },
    });

    res.status(201).json({ message: "Sub-category created", subCategory });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Sub-category already exists in this category" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getSubCategories = async (req, res) => {
  try {
    const subCategories = await prisma.subCategory.findMany({
      include: {
        category: { select: { id: true, name: true } },
        parent: { select: { id: true, name: true } },
        _count: { select: { children: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getSubCategoriesByCategory = async (req, res) => {
  try {
    const subCategories = await prisma.subCategory.findMany({
      where: { categoryId: req.params.categoryId, isActive: true },
      include: {
        children: { where: { isActive: true }, orderBy: { name: "asc" } },
      },
      orderBy: { name: "asc" },
    });
    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateSubCategory = async (req, res) => {
  try {
    const { name, categoryId, isActive, parentId } = req.body;
    const data = {};
    if (name) {
      data.name = name;
      data.slug = toSlug(name);
    }
    if (categoryId) data.categoryId = categoryId;
    if (isActive !== undefined) data.isActive = isActive !== "false";

    const nextCategoryId = data.categoryId;
    if (parentId !== undefined) {
      if (!parentId) {
        data.parentId = null;
      } else {
        if (parentId === req.params.id || (await wouldCreateCycle(req.params.id, parentId))) {
          return res.status(400).json({ message: "A sub-category cannot be its own parent" });
        }
        const parent = await prisma.subCategory.findUnique({ where: { id: parentId }, select: { categoryId: true } });
        if (!parent) return res.status(400).json({ message: "Parent sub-category not found" });
        if (nextCategoryId && parent.categoryId !== nextCategoryId) {
          return res.status(400).json({ message: "Parent sub-category must belong to the same category" });
        }
        data.parentId = parentId;
      }
    }

    const subCategory = await prisma.subCategory.update({
      where: { id: req.params.id },
      data,
    });
    res.json({ message: "Sub-category updated", subCategory });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteSubCategory = async (req, res) => {
  try {
    await prisma.subCategory.delete({ where: { id: req.params.id } });
    res.json({ message: "Sub-category deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createSubCategory, getSubCategories, getSubCategoriesByCategory, updateSubCategory, deleteSubCategory };
