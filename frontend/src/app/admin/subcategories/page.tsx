"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";

interface Category {
  id: string;
  name: string;
}

interface SubCategory {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  category: { id: string; name: string };
}

export default function AdminSubCategoriesPage() {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", categoryId: "", isActive: "true" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [subRes, catRes] = await Promise.all([
        api.get("/subcategories"),
        api.get("/categories"),
      ]);
      setSubCategories(subRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ name: "", categoryId: "", isActive: "true" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Enter sub-category name"); return; }
    if (!form.categoryId) { toast.error("Select a parent category"); return; }

    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/subcategories/${editingId}`, form);
        toast.success("Sub-category updated!");
      } else {
        await api.post("/subcategories", form);
        toast.success("Sub-category created!");
      }
      resetForm();
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (sub: SubCategory) => {
    setForm({ name: sub.name, categoryId: sub.category.id, isActive: String(sub.isActive) });
    setEditingId(sub.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this sub-category?")) return;
    try {
      await api.delete(`/subcategories/${id}`);
      toast.success("Sub-category deleted");
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete");
    }
  };

  if (loading) {
    return <div className="text-center py-10"><div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sub Categories</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FiPlus size={18} /> Add Sub Category
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{editingId ? "Edit" : "Add"} Sub Category</h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><FiX size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Parent Category *</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sub Category Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. 2 MP, 4 MP, Bullet Camera"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isActive === "true"}
                  onChange={(e) => setForm({ ...form, isActive: String(e.target.checked) })}
                  className="rounded"
                />
                <span className="text-sm">Active</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 bg-primary hover:bg-primary-dark text-white py-2.5 rounded-lg disabled:opacity-50">
                  {saving ? "Saving..." : editingId ? "Update" : "Create"}
                </button>
                <button type="button" onClick={resetForm} className="px-6 py-2.5 border rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Sub Category</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Parent Category</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
              <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {subCategories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                  No sub-categories yet. Click &quot;Add Sub Category&quot; to create one.
                </td>
              </tr>
            ) : (
              subCategories.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-medium">{sub.name}</span>
                    <span className="text-xs text-gray-400 ml-2">/{sub.slug}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">{sub.category.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${sub.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {sub.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEdit(sub)} className="text-gray-400 hover:text-primary p-1.5 rounded">
                      <FiEdit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(sub.id)} className="text-gray-400 hover:text-red-500 p-1.5 rounded ml-1">
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
