"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { FiUpload, FiFile, FiTrash2, FiX, FiStar } from "react-icons/fi";

interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  subCategories?: SubCategory[];
}

interface ProductImage {
  id: string;
  url: string;
  publicId: string;
  isPrimary: boolean;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [images, setImages] = useState<ProductImage[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [datasheet, setDatasheet] = useState<string | null>(null);
  const [datasheetFile, setDatasheetFile] = useState<File | null>(null);

  const imageRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    mrp: "",
    sku: "",
    stock: "0",
    categoryId: "",
    subCategoryId: "",
    isActive: "true",
    isFeatured: "false",
    specifications: "",
  });

  useEffect(() => {
    loadData();
  }, [params.id]);

  const loadData = async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        api.get("/categories/public"),

        api.get(`/products/public/${params.id}`).catch(() => null),
      ]);

      setCategories(catRes.data);

      let product = prodRes?.data;

      if (!product) {
        const allProducts = await api.get("/products?limit=100");

        product = allProducts.data.products.find(
          (p: any) => p.id === params.id,
        );
      }

      if (product) {
        setForm({
          name: product.name || "",

          description: product.description || "",

          price: String(product.price || ""),

          mrp: product.mrp ? String(product.mrp) : "",

          sku: product.sku || "",

          stock: String(product.stock || 0),

          categoryId: product.categoryId || "",

          subCategoryId: product.subCategoryId || "",

          isActive: String(product.isActive),

          isFeatured: String(product.isFeatured),

          specifications: product.specifications
            ? JSON.stringify(product.specifications, null, 2)
            : "",
        });

        setImages(product.images || []);

        setDatasheet(product.datasheet || null);

        const cat = catRes.data.find(
          (c: Category) => c.id === product.categoryId,
        );

        setSubCategories(cat?.subCategories || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPageLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const tooBig = files.filter((f) => f.size > 1024 * 1024);
    if (tooBig.length > 0) {
      toast.error(`Image${tooBig.length > 1 ? "s" : ""} too large — max 1 MB each (${tooBig[0].name}: ${(tooBig[0].size / 1024 / 1024).toFixed(1)} MB)`);
      e.target.value = "";
      return;
    }

    if (images.length + newImages.length + files.length > 5) {
      toast.error("Maximum 5 images allowed");

      return;
    }

    setNewImages([...newImages, ...files]);

    setImagePreviews([
      ...imagePreviews,

      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const removeNewImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index));

    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    if (newImages.length === 0) return;

    const formData = new FormData();

    newImages.forEach((file) => {
      formData.append("images", file);
    });

    await api.post(
      `/products/${params.id}/images`,

      formData,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  };

  const deleteExistingImage = async (imageId: string) => {
    if (!confirm("Delete this image?")) return;
    try {
      const res = await api.delete(`/products/${params.id}/images/${imageId}`);
      setImages(res.data.product?.images || images.filter((i) => i.id !== imageId));
      toast.success("Image deleted");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete image");
    }
  };

  const setPrimaryImage = async (imageId: string) => {
    try {
      const res = await api.put(`/products/${params.id}/images/${imageId}/primary`);
      if (res.data.product?.images) setImages(res.data.product.images);
      else setImages(images.map((i) => ({ ...i, isPrimary: i.id === imageId })));
      toast.success("Primary image updated");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to set primary");
    }
  };

  const uploadDatasheet = async () => {
    if (!datasheetFile) return;

    const dsForm = new FormData();

    dsForm.append("datasheet", datasheetFile);

    const res = await api.post(
      `/products/${params.id}/datasheet`,

      dsForm,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    setDatasheet(res.data.url);
    toast.success("Datasheet uploaded");
  };

  const removeDatasheet = async () => {
    if (!confirm("Remove this datasheet? It will be deleted permanently.")) return;
    try {
      await api.delete(`/products/${params.id}/datasheet`);
      setDatasheet(null);
      setDatasheetFile(null);
      toast.success("Datasheet removed");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to remove datasheet");
    }
  };


  const uploadError = (error: any, fallback: string) =>
    error.response?.status === 413
      ? "File too large — product images must be under 1 MB each (or check your server limit)"
      : error.response?.data?.message || fallback;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      await api.put(
        `/products/${params.id}`,

        form,
      );

      await uploadImages();

      await uploadDatasheet();

      toast.success("Product updated!");

      router.push("/admin/products");
    } catch (error: any) {
      toast.error(uploadError(error, "Failed to update product"));
    } finally {
      setLoading(false);
    }
  };
  if (pageLoading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <h2 className="font-semibold text-lg">Basic Info</h2>

          <input
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            placeholder="Product Name"
            className="w-full px-4 py-2 border rounded-lg"
          />

          <textarea
            rows={4}
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            placeholder="Description"
            className="w-full px-4 py-2 border rounded-lg"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm({
                  ...form,
                  price: e.target.value,
                })
              }
              placeholder="Price"
              className="px-4 py-2 border rounded-lg"
            />

            <input
              type="number"
              value={form.mrp}
              onChange={(e) =>
                setForm({
                  ...form,
                  mrp: e.target.value,
                })
              }
              placeholder="MRP"
              className="px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              value={form.sku}
              onChange={(e) =>
                setForm({
                  ...form,
                  sku: e.target.value,
                })
              }
              placeholder="SKU"
              className="px-4 py-2 border rounded-lg"
            />

            <input
              type="number"
              value={form.stock}
              onChange={(e) =>
                setForm({
                  ...form,
                  stock: e.target.value,
                })
              }
              placeholder="Stock"
              className="px-4 py-2 border rounded-lg"
            />
          </div>

          <select
            value={form.categoryId}
            onChange={(e) => {
              const id = e.target.value;

              setForm({
                ...form,
                categoryId: id,
                subCategoryId: "",
              });

              const cat = categories.find((c) => c.id === id);

              setSubCategories(cat?.subCategories || []);
            }}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Select Category</option>

            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {subCategories.length > 0 && (
            <select
              value={form.subCategoryId}
              onChange={(e) =>
                setForm({
                  ...form,
                  subCategoryId: e.target.value,
                })
              }
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Select Sub Category</option>

              {subCategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          )}

          <div className="flex gap-6">
            <label>
              <input
                type="checkbox"
                checked={form.isActive === "true"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    isActive: String(e.target.checked),
                  })
                }
              />{" "}
              Active
            </label>

            <label>
              <input
                type="checkbox"
                checked={form.isFeatured === "true"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    isFeatured: String(e.target.checked),
                  })
                }
              />{" "}
              Featured
            </label>
          </div>

          <textarea
            rows={5}
            value={form.specifications}
            onChange={(e) =>
              setForm({
                ...form,
                specifications: e.target.value,
              })
            }
            placeholder="Specifications JSON"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* IMAGES */}

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="font-semibold text-lg mb-4">Product Images</h2>

          <div className="flex flex-wrap gap-3">
            {images.map((img) => (
              <div
                key={img.id}
                className={`group relative w-24 h-24 border-2 rounded overflow-hidden ${img.isPrimary ? "border-primary" : "border-gray-200"}`}
              >
                <img src={img.url} className="w-full h-full object-cover" />

                {img.isPrimary && (
                  <span className="absolute bottom-0 left-0 right-0 bg-primary text-white text-[10px] font-semibold text-center py-0.5">
                    Primary
                  </span>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5">
                  {!img.isPrimary && (
                    <button
                      type="button"
                      onClick={() => setPrimaryImage(img.id)}
                      title="Set as primary"
                      className="bg-white/90 text-yellow-600 rounded-full w-6 h-6 flex items-center justify-center hover:bg-white"
                    >
                      <FiStar size={13} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteExistingImage(img.id)}
                    title="Delete image"
                    className="bg-white/90 text-red-600 rounded-full w-6 h-6 flex items-center justify-center hover:bg-white"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </div>
            ))}

            {imagePreviews.map((src, i) => (
              <div key={i} className="relative w-24 h-24 border rounded">
                <img src={src} className="w-full h-full object-cover rounded" />

                <button
                  type="button"
                  onClick={() => removeNewImage(i)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5"
                >
                  <FiX size={12} />
                </button>
              </div>
            ))}

            <label className="w-24 h-24 border-2 border-dashed flex items-center justify-center cursor-pointer">
              <FiUpload />

              <input
                ref={imageRef}
                hidden
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>
        {/* DATASHEET */}

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="font-semibold text-lg mb-4">
            Product Datasheet (PDF)
          </h2>

          {datasheet ? (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
              <div className="flex items-center gap-3">
                <FiFile size={24} className="text-red-500" />

                <div>
                  <p className="text-sm font-medium">Existing Datasheet</p>

                  <a
                    href={datasheet}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-xs"
                  >
                    View PDF
                  </a>
                </div>
              </div>

              <button
                type="button"
                onClick={removeDatasheet}
                className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-800"
              >
                <FiTrash2 size={15} /> Remove
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-4">No datasheet uploaded</p>
          )}

          {datasheetFile ? (
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <FiFile className="text-red-500" size={22} />

                <div>
                  <p className="text-sm font-medium">{datasheetFile.name}</p>

                  <p className="text-xs text-gray-400">
                    {(datasheetFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDatasheetFile(null)}
                className="text-red-500"
              >
                <FiX />
              </button>
            </div>
          ) : (
            <label className="block border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary">
              <FiUpload className="mx-auto text-gray-400 mb-2" size={25} />

              <p className="text-sm text-gray-500">{datasheet ? "Upload to replace current datasheet" : "Upload New Datasheet"}</p>

              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (!file) return;

                  if (file.size > 10 * 1024 * 1024) {
                    toast.error("Max 10MB allowed");

                    return;
                  }

                  setDatasheetFile(file);
                }}
              />
            </label>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Product"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
