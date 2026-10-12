const prisma = require("../config/db");

const createSubCategory = async (req, res) => {
  try {
    const { name, categoryId, isActive } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const subCategory = await prisma.subCategory.create({
      data: { name, slug, categoryId, isActive: isActive !== "false" },
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
      include: { category: { select: { id: true, name: true } } },
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
      orderBy: { name: "asc" },
    });
    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateSubCategory = async (req, res) => {
  try {
    const { name, categoryId, isActive } = req.body;
    const data = {};
    if (name) {
      data.name = name;
      data.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    if (categoryId) data.categoryId = categoryId;
    if (isActive !== undefined) data.isActive = isActive !== "false";

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
