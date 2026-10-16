"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2, FiImage } from "react-icons/fi";

interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  isActive: boolean;
  order: number;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", subtitle: "", link: "", isActive: "true", order: "0" });
  const [image, setImage] = useState<File | null>(null);
  const [isValidatingImage, setIsValidatingImage] = useState(false);
  const [imageValidation, setImageValidation] = useState<{ valid: boolean; message: string } | null>(null);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const res = await api.get("/banners");
      setBanners(res.data);
    } catch (error) {
      toast.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files?.[0] || null;
    setImage(selectedImage);
    setImageValidation(null);
    if (!selectedImage) return;

    if (selectedImage.size > 5 * 1024 * 1024) {
      setImageValidation({
        valid: false,
        message: `Image too large — max 5 MB (${selectedImage.name}: ${(selectedImage.size / 1024 / 1024).toFixed(1)} MB)`,
      });
      return;
    }

    setIsValidatingImage(true);
    try {
      const bitmap = await createImageBitmap(selectedImage);
      const { width, height } = bitmap;
      bitmap.close();

      if (width !== 1900 || height !== 568) {
        setImageValidation({
          valid: false,
          message: `Selected image is ${width} x ${height} px. Banner must be exactly 1900 x 568 px.`,
        });
        return;
      }

      setImageValidation({ valid: true, message: "Image dimensions verified: 1900 x 568 px." });
    } catch {
      setImageValidation({ valid: false, message: "Could not read image dimensions. Choose a valid image file." });
    } finally {
      setIsValidatingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) { toast.error("Choose a banner image that is exactly 1900 x 568 px"); return; }
    if (isValidatingImage) { toast.error("Wait while the image dimensions are checked"); return; }
    if (!imageValidation?.valid) {
      toast.error(imageValidation?.message || "Banner image must be exactly 1900 x 568 px");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("subtitle", form.subtitle);
      formData.append("link", form.link);
      formData.append("isActive", form.isActive);
      formData.append("order", form.order);
      formData.append("image", image);

      await api.post("/banners", formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Banner created");
      setShowForm(false);
      setForm({ title: "", subtitle: "", link: "", isActive: "true", order: "0" });
      setImage(null);
      setImageValidation(null);
      loadBanners();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create banner");
    }
  };

  const deleteBanner = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    try {
      await api.delete(`/banners/${id}`);
      toast.success("Banner deleted");
      loadBanners();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Banners</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <FiPlus /> Add Banner
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
            <input type="text" placeholder="Subtitle" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Link URL" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
            <input type="number" placeholder="Order" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
            <div className="space-y-1.5">
              <label htmlFor="banner-image" className="block text-sm font-medium text-gray-700">Banner image · exactly 1900 x 568 px</label>
              <input id="banner-image" type="file" accept="image/*" required onChange={handleImageChange} className="text-sm" aria-describedby="banner-image-guidance banner-image-status" />
              <p id="banner-image-guidance" className="text-xs text-gray-500">Max 5 MB. Other dimensions will be rejected to prevent cropping or distortion.</p>
              <p id="banner-image-status" aria-live="polite" className={`text-xs ${isValidatingImage ? "text-gray-500" : imageValidation?.valid ? "text-green-700" : imageValidation ? "text-red-600" : ""}`}>
                {isValidatingImage ? "Checking image dimensions…" : imageValidation?.message || ""}
              </p>
            </div>
          </div>
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg">Create Banner</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative aspect-[1900/568] bg-gray-100">
              <Image src={banner.image} alt={banner.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain" />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium">{banner.title}</h3>
                <p className="text-sm text-gray-500">Order: {banner.order}</p>
              </div>
              <button onClick={() => deleteBanner(banner.id)} className="text-red-600 hover:text-red-800">
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
