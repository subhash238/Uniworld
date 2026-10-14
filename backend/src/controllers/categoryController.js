const prisma = require("../config/db");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");

const createCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    let image = null;
    let publicId = null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "uniworld/categories");
      image = result.secure_url;
      publicId = result.public_id;
    }

    const category = await prisma.category.create({
      data: { name, slug, description, image, isActive: isActive !== "false" },
    });

    res.status(201).json({ message: "Category created", category });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Category with this name already exists" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getActiveCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { products: true } },
        subCategories: {
          where: { isActive: true },
          include: { children: { where: { isActive: true }, orderBy: { name: "asc" } } },
          orderBy: { name: "asc" },
        },
      },
      orderBy: { name: "asc" },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getCategoryBySlug = async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug },
      include: {
        subCategories: {
          where: { isActive: true },
          include: {
            _count: { select: { products: true } },
            children: {
              where: { isActive: true },
              include: { _count: { select: { products: true } } },
              orderBy: { name: "asc" },
            },
          },
          orderBy: { name: "asc" },
        },
        products: {
          where: { isActive: true },
          include: {
            images: { where: { isPrimary: true } },
            subCategory: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    const data = {};

    if (name) {
      data.name = name;
      data.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    if (description !== undefined) data.description = description;
    if (isActive !== undefined) data.isActive = isActive !== "false";

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "uniworld/categories");
      data.image = result.secure_url;
    }

    const category = await prisma.category.update({
      where: { id: req.params.id },
      data,
    });

    res.json({ message: "Category updated", category });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const removeCategoryImage = async (req, res) => {
  try {
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: { image: null },
    });
    res.json({ message: "Category image removed", category });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const productCount = await prisma.product.count({ where: { categoryId: req.params.id } });
    if (productCount > 0) {
      return res.status(400).json({ message: "Cannot delete category with products. Remove products first." });
    }

    await prisma.category.delete({ where: { id: req.params.id } });
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createCategory, getCategories, getActiveCategories, getCategoryBySlug, updateCategory, removeCategoryImage, deleteCategory };
