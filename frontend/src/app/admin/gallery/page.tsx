"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { FiEdit2, FiExternalLink, FiImage, FiPlay, FiPlus, FiTrash2, FiX } from "react-icons/fi";

interface GalleryItem {
  id: string;
  title: string;
  mediaType: string;
  fileUrl: string;
  isActive: boolean;
  order: number;
}

const emptyForm = { title: "", order: "0", isActive: true };

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await api.get("/gallery");
      setItems(response.data);
    } catch {
      toast.error("Failed to load gallery items");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setFile(null);
  };

  const editItem = (item: GalleryItem) => {
    setEditingId(item.id);
    setForm({ title: item.title, order: String(item.order), isActive: item.isActive });
    setFile(null);
    setShowForm(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingId && !file) {
      toast.error("Choose a photo or video to upload");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title.trim());
    formData.append("order", form.order);
    formData.append("isActive", String(form.isActive));
    if (file) formData.append("file", file);

    setSaving(true);
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      if (editingId) {
        await api.put(`/gallery/${editingId}`, formData, config);
        toast.success("Gallery item updated");
      } else {
        await api.post("/gallery", formData, config);
        toast.success("Gallery item added");
      }
      resetForm();
      await loadItems();
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message;
      toast.error(message || "Failed to save gallery item");
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (item: GalleryItem) => {
    if (!confirm(`Delete “${item.title}” from the gallery?`)) return;
    try {
      await api.delete(`/gallery/${item.id}`);
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      toast.success("Gallery item deleted");
    } catch {
      toast.error("Failed to delete gallery item");
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gallery</h1>
          <p className="mt-1 text-sm text-slate-500">Photos and videos shown on the public Gallery page.</p>
        </div>
        <button
          type="button"
          onClick={() => (showForm && !editingId ? resetForm() : (setEditingId(null), setForm(emptyForm), setFile(null), setShowForm(true)))}
          className="inline-flex h-10 items-center gap-2 bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          {showForm && !editingId ? <FiX /> : <FiPlus />}
          {showForm && !editingId ? "Close" : "Add media"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="font-semibold text-slate-900">{editingId ? "Edit gallery item" : "New gallery item"}</h2>
            {editingId && <button type="button" onClick={resetForm} className="text-slate-500 hover:text-slate-900" aria-label="Close form"><FiX /></button>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Title <span className="text-red-600">*</span>
              <input required maxLength={140} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Office CCTV installation" className="mt-1.5 h-10 w-full border border-slate-300 px-3 font-normal outline-none focus:border-primary" />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Display order
              <input type="number" min="0" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className="mt-1.5 h-10 w-full border border-slate-300 px-3 font-normal outline-none focus:border-primary" />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Photo or video {editingId ? <span className="font-normal text-slate-500">(leave empty to keep current)</span> : <span className="text-red-600">*</span>}
              <input type="file" accept="image/*,video/*" required={!editingId} onChange={(e) => setFile(e.target.files?.[0] || null)} className="mt-1.5 block w-full text-sm text-slate-600 file:mr-4 file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:font-semibold file:text-slate-700 hover:file:bg-slate-200" />
              <span className="mt-1 block text-xs font-normal text-slate-500">Image or video up to 100 MB.</span>
            </label>
            <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium text-slate-700">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="h-4 w-4 accent-primary" />
              Visible on website
            </label>
          </div>

          <div className="mt-5 flex gap-2">
            <button type="submit" disabled={saving} className="h-10 bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60">
              {saving ? "Uploading…" : editingId ? "Save changes" : "Upload"}
            </button>
            <button type="button" onClick={resetForm} className="h-10 border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Loading gallery…</div>
      ) : items.length === 0 ? (
        <div className="border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <FiImage className="mx-auto mb-3 text-slate-400" size={26} />
          <p className="font-medium text-slate-700">No media yet</p>
          <p className="mt-1 text-sm text-slate-500">Upload photos or videos to show them on the Gallery page.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article key={item.id} className="overflow-hidden border border-slate-200 bg-white">
              <div className="relative aspect-[16/9] bg-slate-100">
                {item.mediaType === "video" ? (
                  <>
                    <video src={item.fileUrl} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                    <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white"><FiPlay size={13} aria-hidden="true" /></span>
                  </>
                ) : (
                  <Image src={item.fileUrl} alt={item.title} fill sizes="(max-width:640px) 100vw, (max-width:1280px) 50vw, 33vw" className="object-cover" />
                )}
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h3 className="line-clamp-2 font-semibold text-slate-900">{item.title}</h3>
                  <span className={`shrink-0 px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${item.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {item.isActive ? "Published" : "Hidden"}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-xs text-slate-500">Order: {item.order}</span>
                  <div className="flex items-center gap-3">
                    <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-primary" aria-label={`Open ${item.title}`}><FiExternalLink size={16} /></a>
                    <button type="button" onClick={() => editItem(item)} className="text-primary hover:text-primary-dark" aria-label={`Edit ${item.title}`}><FiEdit2 size={16} /></button>
                    <button type="button" onClick={() => deleteItem(item)} className="text-red-600 hover:text-red-800" aria-label={`Delete ${item.title}`}><FiTrash2 size={16} /></button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
