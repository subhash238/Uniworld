"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  _count: {
    products: number;
  };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    isActive: "true",
  });

  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("isActive", form.isActive);

      if (image) {
        formData.append("image", image);
      }

      if (editingId) {
        await api.put(`/categories/${editingId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success("Category updated");
      } else {
        await api.post("/categories", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success("Category created");
      }

      resetForm();
      loadCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const editCategory = (cat: Category) => {
    setEditingId(cat.id);

    setForm({
      name: cat.name,
      description: cat.description || "",
      isActive: String(cat.isActive),
    });

    setPreviewImage(cat.image || "");
    setImage(null);

    setShowForm(true);
  };

  const deleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;

    try {
      await api.delete(`/categories/${id}`);

      toast.success("Category deleted");

      loadCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete");
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);

    setForm({
      name: "",
      description: "",
      isActive: "true",
    });

    setImage(null);
    setPreviewImage("");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FiPlus />

          {showForm ? "Close" : "Add Category"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-sm mb-6 space-y-4"
        >
          <h2 className="font-semibold">
            {editingId ? "Edit Category" : "New Category"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Category Name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className="px-4 py-2 border rounded-lg"
            />

            <input
              type="text"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              className="px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="rounded-lg border border-blue-100 bg-blue-50/70 p-3 text-xs text-blue-900">
            <p className="font-semibold text-blue-950">
              📐 UI/UX Guide for Category Showcase Banner (Homepage &quot;Our Products&quot; Center Column):
            </p>
            <p className="mt-1 text-blue-850">
              Recommended image size: <strong>600 × 800 px (Portrait/Vertical 3:4 ratio)</strong>.
              <br />
              <strong>Tip:</strong> Image ke upar 70% portion me product/camera graphic rakhein, aur bottom 30% plain/dark background rakhein kyunki website par bottom me Category Name &amp; Description automatically render hota hai.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div>
              {previewImage && (
                <img
                  src={previewImage}
                  alt="preview"
                  className="w-20 h-28 object-cover rounded-lg border mb-2 shadow-sm"
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setImage(file);
                  if (file) {
                    setPreviewImage(URL.createObjectURL(file));
                  }
                }}
                className="text-xs text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-gray-800 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-black cursor-pointer"
              />
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isActive === "true"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    isActive: String(e.target.checked),
                  })
                }
              />

              <span>Active</span>
            </label>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-lg"
            >
              {editingId ? "Update" : "Create"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Image</th>

              <th className="px-4 py-3 text-left">Name</th>

              <th className="px-4 py-3 text-left">Description</th>

              <th className="px-4 py-3 text-left">Slug</th>

              <th className="px-4 py-3 text-left">Products</th>

              <th className="px-4 py-3 text-left">Status</th>

              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-14 h-14 rounded object-cover"
                    />
                  ) : (
                    "-"
                  )}
                </td>

                <td className="px-4 py-3 font-medium">{cat.name}</td>

                <td className="px-4 py-3 max-w-xs">{cat.description || "-"}</td>

                <td className="px-4 py-3 text-gray-500">{cat.slug}</td>

                <td className="px-4 py-3">{cat._count.products}</td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      cat.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {cat.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => editCategory(cat)}
                      className="text-primary"
                    >
                      <FiEdit2 size={16} />
                    </button>

                    <button
                      onClick={() => deleteCategory(cat.id, cat.name)}
                      className="text-red-600"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
