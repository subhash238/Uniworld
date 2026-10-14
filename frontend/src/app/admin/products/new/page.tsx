"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { FiUpload, FiX } from "react-icons/fi";

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

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [datasheetFile, setDatasheetFile] = useState<File | null>(null);

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
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await api.get("/categories/public");
      setCategories(res.data);
    } catch (error) {
      console.error(error);
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
    if (images.length + files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    setImages([...images, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };


  const uploadError = (error: any, fallback: string) =>
    error.response?.status === 413
      ? "File too large — product images must be under 1 MB each (or check your server limit)"
      : error.response?.data?.message || fallback;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryId) { toast.error("Select a category"); return; }
    if (!form.price) { toast.error("Enter price"); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      images.forEach((file) => formData.append("images", file));

      const res = await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Upload datasheet if selected
      if (datasheetFile && res.data.product?.id) {
        const dsForm = new FormData();
        dsForm.append("datasheet", datasheetFile);
        await api.post(`/products/${res.data.product.id}/datasheet`, dsForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success("Product created!");
      router.push("/admin/products");
    } catch (error: any) {
      toast.error(uploadError(error, "Failed to create product"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <h2 className="font-semibold text-lg">Basic Info</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Product Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price (₹) *</label>
              <input
                type="number"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">MRP (₹)</label>
              <input
                type="number"
                value={form.mrp}
                onChange={(e) => setForm({ ...form, mrp: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">SKU</label>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select
              value={form.categoryId}
              onChange={(e) => {
                const catId = e.target.value;
                setForm({ ...form, categoryId: catId, subCategoryId: "" });
                const cat = categories.find(c => c.id === catId);
                setSubCategories(cat?.subCategories || []);
              }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {subCategories.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-1">Sub Category</label>
              <select
                value={form.subCategoryId}
                onChange={(e) => setForm({ ...form, subCategoryId: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="">Select Sub Category (optional)</option>
                {subCategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.isActive === "true"} onChange={(e) => setForm({ ...form, isActive: String(e.target.checked) })} className="rounded" />
              <span className="text-sm">Active</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.isFeatured === "true"} onChange={(e) => setForm({ ...form, isFeatured: String(e.target.checked) })} className="rounded" />
              <span className="text-sm">Featured</span>
            </label>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <h2 className="font-semibold text-lg">Product Images (Max 5)</h2>

          <div className="flex flex-wrap gap-3">
            {previews.map((src, i) => (
              <div key={i} className="relative w-24 h-24 border rounded">
                <img src={src} alt="" className="w-full h-full object-cover rounded" />
                <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                  <FiX size={12} />
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-primary">
                <FiUpload className="text-gray-400" />
                <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <h2 className="font-semibold text-lg">Specifications (JSON)</h2>
          <textarea
            rows={4}
            placeholder='{"Resolution": "4MP", "Lens": "2.8mm", "IR Range": "30m"}'
            value={form.specifications}
            onChange={(e) => setForm({ ...form, specifications: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none resize-none font-mono text-sm"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <h2 className="font-semibold text-lg">Product Datasheet (PDF)</h2>
          {datasheetFile ? (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-red-500 text-xl">📄</span>
                <div>
                  <p className="text-sm font-medium">{datasheetFile.name}</p>
                  <p className="text-xs text-gray-400">{(datasheetFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button type="button" onClick={() => setDatasheetFile(null)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                <FiX size={18} />
              </button>
            </div>
          ) : (
            <label className="block border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-orange-50/30 transition-colors">
              <FiUpload size={24} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Click to select PDF datasheet</p>
              <p className="text-xs text-gray-400 mt-1">Max 10MB, PDF only</p>
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 10 * 1024 * 1024) { toast.error("Max 10MB"); return; }
                  setDatasheetFile(file);
                }}
              />
            </label>
          )}
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg disabled:opacity-50">
            {loading ? "Creating..." : "Create Product"}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-3 border rounded-lg hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
