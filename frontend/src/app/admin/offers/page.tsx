"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/api";
import toast from "react-hot-toast";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiExternalLink,
  FiImage,
  FiStar,
  FiGrid,
  FiCheck,
  FiX,
  FiAlertCircle,
  FiInfo,
} from "react-icons/fi";

interface OfferItem {
  id: string;
  title: string;
  description?: string | null;
  image: string;
  link?: string | null;
  buttonText?: string | null;
  position: "featured" | "grid";
  order: number;
  isActive: boolean;
}

const emptyForm = {
  link: "",
  position: "grid" as "featured" | "grid",
  order: "0",
  isActive: true,
};

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      const res = await api.get("/offers");
      setOffers(res.data);
    } catch {
      toast.error("Failed to load offer items");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview("");
  };

  const startEdit = (item: OfferItem) => {
    setEditingId(item.id);
    setForm({
      link: item.link || "",
      position: item.position || "grid",
      order: String(item.order),
      isActive: item.isActive,
    });
    setImagePreview(item.image);
    setImageFile(null);
    setShowForm(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate aspect ratio or dimension
      const img = new window.Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        const { width, height } = img;
        const ratio = width / height;

        if (form.position === "featured") {
          // Recommended: 16:10 or 4:3 (approx 1.2 to 1.6)
          if (ratio < 1.0 || ratio > 2.0) {
            toast(
              `Tip: Large Featured Banner looks best in 16:10 aspect ratio (~1200x750px). Your image is ${width}x${height}px.`,
              { icon: "📐", duration: 5000 }
            );
          }
        } else {
          // Recommended: ~1.4 to 1.7 (e.g., 600x400 or 800x500)
          if (ratio < 1.1 || ratio > 2.0) {
            toast(
              `Tip: Grid Card Poster looks best in 3:2 ratio (~600x400px). Your image is ${width}x${height}px.`,
              { icon: "📐", duration: 5000 }
            );
          }
        }
      };
      img.src = objectUrl;

      setImageFile(file);
      setImagePreview(objectUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId && !imageFile && !imagePreview) {
      toast.error("Please upload an offer poster image");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("link", form.link);
      formData.append("position", form.position);
      formData.append("order", form.order);
      formData.append("isActive", String(form.isActive));

      if (imageFile) {
        formData.append("image", imageFile);
      } else if (imagePreview && !imagePreview.startsWith("blob:")) {
        formData.append("imageUrl", imagePreview);
      }

      if (editingId) {
        await api.put(`/offers/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Offer updated successfully");
      } else {
        await api.post("/offers", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Offer poster added successfully");
      }

      resetForm();
      loadOffers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save offer");
    } finally {
      setSaving(false);
    }
  };

  const deleteOffer = async (id: string) => {
    if (!confirm("Are you sure you want to delete this offer item?")) return;
    try {
      await api.delete(`/offers/${id}`);
      toast.success("Offer deleted");
      loadOffers();
    } catch {
      toast.error("Failed to delete offer");
    }
  };

  const featuredOffers = offers.filter((o) => o.position === "featured");
  const gridOffers = offers.filter((o) => o.position === "grid");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">We Offer Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your homepage &quot;We Offer&quot; posters, redirect URLs, positions and display order.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 bg-[#1B2A4A] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1B2A4A]/90 transition shadow-sm"
        >
          <FiPlus size={18} /> Add Offer Poster
        </button>
      </div>

      {/* Guidelines Alert Banner for perfect responsive UI/UX on all screens */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-blue-900 shadow-sm">
        <div className="flex items-start gap-3">
          <FiInfo className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
          <div className="text-xs sm:text-sm space-y-1">
            <p className="font-semibold text-blue-950">
              📐 UI/UX Guide for Best Display on All Screen Sizes (Mobile, Tablet & Desktop):
            </p>
            <ul className="list-disc list-inside space-y-1 text-blue-800 text-xs sm:text-[13px]">
              <li>
                <strong>Left Large Featured Banner:</strong> Recommended image size{" "}
                <span className="font-mono bg-blue-100 px-1 py-0.5 rounded text-blue-900 font-bold">1200 × 750 px</span> (16:10 ratio).
              </li>
              <li>
                <strong>Right Grid Cards (CP PLUS style):</strong> Recommended image size{" "}
                <span className="font-mono bg-blue-100 px-1 py-0.5 rounded text-blue-900 font-bold">600 × 400 px</span> (3:2 ratio).
              </li>
              <li>
                Sirf posters upload karein — text and graphics poster me hi design hone par website pe bina kisi overlap ke clean dikhta hai.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal / Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editingId ? "Edit Offer Poster" : "Add Offer Poster"}
                </h2>
                <p className="text-xs text-gray-500">
                  Fill in redirect URL, card position &amp; display order.
                </p>
              </div>
              <button
                onClick={resetForm}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-5">
              {/* Poster Image Upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Offer Poster Image <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  {imagePreview ? (
                    <div className="relative h-32 w-48 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-32 w-48 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400 shrink-0">
                      <FiImage size={32} />
                    </div>
                  )}
                  <div className="w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="text-xs text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-[#1B2A4A] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-[#1B2A4A]/90 cursor-pointer"
                    />
                    <p className="mt-2 text-[11px] text-gray-500">
                      PNG, JPG, WebP supported. High quality recommendation: 1200x750px (Featured) or 600x400px (Grid).
                    </p>
                  </div>
                </div>
              </div>

              {/* Redirect URL */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Redirect URL (Link)
                </label>
                <input
                  type="text"
                  placeholder="e.g. /products, /categories/wifi-pt or https://..."
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-[#1B2A4A] focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-gray-400">
                  Jab user website pe poster par click karega to is page par redirect hoga.
                </p>
              </div>

              {/* Card Position & Display Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Position */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Card Position <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.position}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        position: e.target.value as "featured" | "grid",
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-[#1B2A4A] focus:outline-none bg-white font-medium"
                  >
                    <option value="featured">Left Large Banner (Featured)</option>
                    <option value="grid">Right Grid Card (Standard)</option>
                  </select>
                </div>

                {/* Display Order */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Display Order (Sorting)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0, 1, 2, 3..."
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-[#1B2A4A] focus:outline-none"
                  />
                  <p className="mt-1 text-[11px] text-gray-400">
                    Lower numbers (e.g. 0, 1) will show first.
                  </p>
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-[#1B2A4A] focus:ring-[#1B2A4A]"
                />
                <label htmlFor="isActive" className="text-xs font-medium text-gray-700 cursor-pointer">
                  Active (Show on website)
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#1B2A4A] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1B2A4A]/90 disabled:opacity-50 shadow-sm"
                >
                  {saving ? "Saving..." : editingId ? "Update Poster" : "Add Poster"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Listing Cards */}
      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1B2A4A] border-t-transparent mx-auto" />
          <p className="mt-2 text-xs text-gray-500">Loading offers...</p>
        </div>
      ) : offers.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-16 text-center shadow-sm">
          <FiImage size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm font-semibold text-gray-700">No offer posters added yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Click the &quot;Add Offer Poster&quot; button above to create one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition"
            >
              {/* Image Preview */}
              <div className="relative aspect-[16/10] w-full bg-gray-100 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title || "Offer"}
                  fill
                  className="object-cover"
                />
                {/* Position Badge */}
                <div className="absolute top-2.5 left-2.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-sm ${
                      item.position === "featured"
                        ? "bg-amber-600"
                        : "bg-blue-600"
                    }`}
                  >
                    {item.position === "featured" ? (
                      <>
                        <FiStar size={11} /> Featured Banner
                      </>
                    ) : (
                      <>
                        <FiGrid size={11} /> Grid Card
                      </>
                    )}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="absolute top-2.5 right-2.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      item.isActive
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-500 text-white"
                    }`}
                  >
                    {item.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Card Meta details */}
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-semibold text-gray-700">Display Order: {item.order}</span>
                    <span className="truncate max-w-[160px] text-gray-400">
                      {item.link ? item.link : "No redirect URL"}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline font-medium"
                    >
                      <FiExternalLink size={12} /> Test Link
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400">No link</span>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(item)}
                      className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 transition"
                      title="Edit"
                    >
                      <FiEdit2 size={15} />
                    </button>
                    <button
                      onClick={() => deleteOffer(item.id)}
                      className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition"
                      title="Delete"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
