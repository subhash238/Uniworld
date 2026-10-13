"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { FiDownload, FiEdit2, FiExternalLink, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { downloadTypes, formatFileSize } from "@/lib/supportLinks";

interface DownloadItem {
  id: string;
  title: string;
  type: string;
  section: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  isActive: boolean;
  order: number;
}

const emptyForm = {
  title: "",
  type: "certificate",
  section: "",
  order: "0",
  isActive: true,
};

const typeLabel = (slug: string) => downloadTypes.find((type) => type.slug === slug)?.title ?? slug;

export default function AdminDownloadsPage() {
  const [items, setItems] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await api.get("/support-downloads");
      setItems(response.data);
    } catch {
      toast.error("Failed to load downloads");
    } finally {
      setLoading(false);
    }
  };

  const sectionSuggestions = useMemo(
    () => Array.from(new Set(items.filter((item) => item.type === form.type).map((item) => item.section))),
    [items, form.type]
  );

  const visibleItems = filter === "all" ? items : items.filter((item) => item.type === filter);

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setFile(null);
  };

  const openNewForm = () => {
    setEditingId(null);
    setForm({ ...emptyForm, type: filter === "all" ? emptyForm.type : filter });
    setFile(null);
    setShowForm(true);
  };

  const editItem = (item: DownloadItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      type: item.type,
      section: item.section,
      order: String(item.order),
      isActive: item.isActive,
    });
    setFile(null);
    setShowForm(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingId && !file) {
      toast.error("Choose a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title.trim());
    formData.append("type", form.type);
    formData.append("section", form.section.trim());
    formData.append("order", form.order);
    formData.append("isActive", String(form.isActive));
    if (file) formData.append("file", file);

    setSaving(true);
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      if (editingId) {
        await api.put(`/support-downloads/${editingId}`, formData, config);
        toast.success("Download updated");
      } else {
        await api.post("/support-downloads", formData, config);
        toast.success("Download added");
      }
      resetForm();
      await loadItems();
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message;
      toast.error(message || "Failed to save download");
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (item: DownloadItem) => {
    if (!confirm(`Delete “${item.title}”?`)) return;
    try {
      await api.delete(`/support-downloads/${item.id}`);
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      toast.success("Download deleted");
    } catch {
      toast.error("Failed to delete download");
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Support Downloads</h1>
          <p className="mt-1 text-sm text-slate-500">Upload certificates, firmware, manuals and software shown under Support → Download.</p>
        </div>
        <button
          type="button"
          onClick={() => (showForm && !editingId ? resetForm() : openNewForm())}
          className="inline-flex h-10 items-center gap-2 bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          {showForm && !editingId ? <FiX /> : <FiPlus />}
          {showForm && !editingId ? "Close" : "Add download"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="font-semibold text-slate-900">{editingId ? "Edit download" : "New download"}</h2>
            {editingId && <button type="button" onClick={resetForm} className="text-slate-500 hover:text-slate-900" aria-label="Close form"><FiX /></button>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Title <span className="text-red-600">*</span>
              <input required maxLength={140} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="e.g. ISO 27001:2022 (ISMS)" className="mt-1.5 h-10 w-full border border-slate-300 px-3 font-normal outline-none focus:border-primary" />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Type <span className="text-red-600">*</span>
              <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} className="mt-1.5 h-10 w-full border border-slate-300 bg-white px-3 font-normal outline-none focus:border-primary">
                {downloadTypes.map((type) => (
                  <option key={type.slug} value={type.slug}>{type.title}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700">
              Section heading <span className="text-red-600">*</span>
              <input required maxLength={100} list="download-sections" value={form.section} onChange={(event) => setForm({ ...form, section: event.target.value })} placeholder="e.g. CE/FCC/RoHS Certificates" className="mt-1.5 h-10 w-full border border-slate-300 px-3 font-normal outline-none focus:border-primary" />
              <datalist id="download-sections">
                {sectionSuggestions.map((section) => <option key={section} value={section} />)}
              </datalist>
            </label>
            <label className="text-sm font-medium text-slate-700">
              Display order
              <input type="number" min="0" value={form.order} onChange={(event) => setForm({ ...form, order: event.target.value })} className="mt-1.5 h-10 w-full border border-slate-300 px-3 font-normal outline-none focus:border-primary" />
            </label>
            <label className="text-sm font-medium text-slate-700">
              File {editingId ? <span className="font-normal text-slate-500">(leave empty to keep current file)</span> : <span className="text-red-600">*</span>}
              <input type="file" required={!editingId} onChange={(event) => setFile(event.target.files?.[0] || null)} className="mt-1.5 block w-full text-sm text-slate-600 file:mr-4 file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:font-semibold file:text-slate-700 hover:file:bg-slate-200" />
              <span className="mt-1 block text-xs font-normal text-slate-500">PDF, ZIP or any file up to 50 MB.</span>
            </label>
            <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium text-slate-700">
              <input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} className="h-4 w-4 accent-primary" />
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

      <div className="mb-4 flex flex-wrap gap-2">
        {[{ slug: "all", title: "All" }, ...downloadTypes].map((type) => {
          const count = type.slug === "all" ? items.length : items.filter((item) => item.type === type.slug).length;
          return (
            <button
              key={type.slug}
              type="button"
              onClick={() => setFilter(type.slug)}
              className={`h-8 border px-3 text-xs font-semibold transition-colors ${filter === type.slug ? "border-primary bg-primary text-white" : "border-slate-300 bg-white text-slate-700 hover:border-primary"}`}
            >
              {type.title} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Loading downloads…</div>
      ) : visibleItems.length === 0 ? (
        <div className="border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <FiDownload className="mx-auto mb-3 text-slate-400" size={26} />
          <p className="font-medium text-slate-700">No downloads yet</p>
          <p className="mt-1 text-sm text-slate-500">Upload a file to list it on the website.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Section</th>
                <th className="px-4 py-3 font-semibold">File</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{item.title}</td>
                  <td className="px-4 py-3 text-slate-600">{typeLabel(item.type)}</td>
                  <td className="px-4 py-3 text-slate-600">{item.section}</td>
                  <td className="px-4 py-3 text-slate-600">
                    <span className="block max-w-[200px] truncate" title={item.fileName}>{item.fileName}</span>
                    <span className="text-xs text-slate-400">{formatFileSize(item.fileSize)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${item.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      {item.isActive ? "Published" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-primary" aria-label={`Open ${item.title}`}><FiExternalLink size={16} /></a>
                      <button type="button" onClick={() => editItem(item)} className="text-primary hover:text-primary-dark" aria-label={`Edit ${item.title}`}><FiEdit2 size={16} /></button>
                      <button type="button" onClick={() => deleteItem(item)} className="text-red-600 hover:text-red-800" aria-label={`Delete ${item.title}`}><FiTrash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
