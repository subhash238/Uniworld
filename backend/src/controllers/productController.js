const prisma = require("../config/db");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");

const createProduct = async (req, res) => {
  try {
    const { name, description, price, mrp, sku, stock, categoryId, subCategoryId, isActive, isFeatured, specifications } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        mrp: mrp ? parseFloat(mrp) : null,
        sku: sku || null,
        stock: parseInt(stock) || 0,
        categoryId,
        subCategoryId: subCategoryId || null,
        isActive: isActive !== "false",
        isFeatured: isFeatured === "true",
        specifications: specifications ? JSON.parse(specifications) : null,
      },
    });

    if (req.files && req.files.length > 0) {
      const imagePromises = req.files.map(async (file, index) => {
        const result = await uploadToCloudinary(file.buffer, "uniworld/products");
        return prisma.productImage.create({
          data: {
            url: result.secure_url,
            publicId: result.public_id,
            isPrimary: index === 0,
            productId: product.id,
          },
        });
      });
      await Promise.all(imagePromises);
    }

    const productWithImages = await prisma.product.findUnique({
      where: { id: product.id },
      include: { images: true, category: true },
    });

    res.status(201).json({ message: "Product created", product: productWithImages });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Product with this name or SKU already exists" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search, featured } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (category) where.categoryId = category;
    if (search) where.name = { contains: search, mode: "insensitive" };
    if (featured === "true") where.isFeatured = true;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { images: { where: { isPrimary: true } }, category: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(limit),
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getPublicProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, subCategory, search, featured } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = { isActive: true };
    if (category) where.categoryId = category;
    if (subCategory) where.subCategoryId = subCategory;
    if (search) where.name = { contains: search, mode: "insensitive" };
    if (featured === "true") where.isFeatured = true;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { images: { where: { isPrimary: true } }, category: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(limit),
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      products,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: { images: true, category: true, subCategory: true },
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, description, price, mrp, sku, stock, categoryId, subCategoryId, isActive, isFeatured, specifications } = req.body;
    const data = {};

    if (name) {
      data.name = name;
      data.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    if (description !== undefined) data.description = description;
    if (price) data.price = parseFloat(price);
    if (mrp !== undefined) data.mrp = mrp ? parseFloat(mrp) : null;
    if (sku !== undefined) data.sku = sku || null;
    if (stock !== undefined) data.stock = parseInt(stock);
    if (categoryId) data.categoryId = categoryId;
    if (subCategoryId !== undefined) data.subCategoryId = subCategoryId || null;
    if (isActive !== undefined) data.isActive = isActive !== "false";
    if (isFeatured !== undefined) data.isFeatured = isFeatured === "true";
    if (specifications) data.specifications = JSON.parse(specifications);

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data,
      include: { images: true, category: true },
    });

    res.json({ message: "Product updated", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const addProductImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images provided" });
    }

    const imagePromises = req.files.map(async (file) => {
      const result = await uploadToCloudinary(file.buffer, "uniworld/products");
      return prisma.productImage.create({
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          isPrimary: false,
          productId: req.params.id,
        },
      });
    });

    await Promise.all(imagePromises);
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { images: true },
    });

    res.json({ message: "Images added", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteProductImage = async (req, res) => {
  try {
    const image = await prisma.productImage.findUnique({ where: { id: req.params.imageId } });
    if (!image) return res.status(404).json({ message: "Image not found" });
    if (image.productId !== req.params.id) return res.status(400).json({ message: "Image does not belong to this product" });

    await deleteFromCloudinary(image.publicId);
    await prisma.productImage.delete({ where: { id: req.params.imageId } });

    // Keep exactly one primary: if the deleted image was primary, promote the first remaining one
    if (image.isPrimary) {
      const next = await prisma.productImage.findFirst({
        where: { productId: req.params.id },
        orderBy: { id: "asc" },
      });
      if (next) {
        await prisma.productImage.update({ where: { id: next.id }, data: { isPrimary: true } });
      }
    }

    const product = await prisma.product.findUnique({ where: { id: req.params.id }, include: { images: true } });
    res.json({ message: "Image deleted", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const setPrimaryImage = async (req, res) => {
  try {
    const image = await prisma.productImage.findUnique({ where: { id: req.params.imageId } });
    if (!image) return res.status(404).json({ message: "Image not found" });
    if (image.productId !== req.params.id) return res.status(400).json({ message: "Image does not belong to this product" });

    await prisma.$transaction([
      prisma.productImage.updateMany({ where: { productId: req.params.id }, data: { isPrimary: false } }),
      prisma.productImage.update({ where: { id: req.params.imageId }, data: { isPrimary: true } }),
    ]);

    const product = await prisma.product.findUnique({ where: { id: req.params.id }, include: { images: true } });
    res.json({ message: "Primary image updated", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { images: true },
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    for (const image of product.images) {
      await deleteFromCloudinary(image.publicId);
    }

    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const uploadDatasheet = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file provided" });

    const result = await uploadToCloudinary(req.file.buffer, "uniworld/datasheets", "raw");
    await prisma.product.update({
      where: { id: req.params.id },
      data: { datasheet: result.secure_url },
    });

    res.json({ message: "Datasheet uploaded", url: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteDatasheet = async (req, res) => {
  try {
    await prisma.product.update({
      where: { id: req.params.id },
      data: { datasheet: null },
    });
    res.json({ message: "Datasheet removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createProduct, getProducts, getPublicProducts, getProductBySlug,
  updateProduct, addProductImages, deleteProductImage, setPrimaryImage, deleteProduct,
  uploadDatasheet, deleteDatasheet,
};
