"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";

interface Dealer {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone: string;
  city?: string;
  state?: string;
  isActive: boolean;
}

export default function AdminDealersPage() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", address: "", city: "", state: "", isActive: "true" });

  useEffect(() => {
    loadDealers();
  }, []);

  const loadDealers = async () => {
    try {
      const res = await api.get("/dealers");
      setDealers(res.data);
    } catch (error) {
      toast.error("Failed to load dealers");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/dealers/${editingId}`, form);
        toast.success("Dealer updated");
      } else {
        await api.post("/dealers", form);
        toast.success("Dealer created");
      }
      resetForm();
      loadDealers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const editDealer = (dealer: Dealer) => {
    setEditingId(dealer.id);
    setForm({
      name: dealer.name,
      company: dealer.company || "",
      email: dealer.email || "",
      phone: dealer.phone,
      address: "",
      city: dealer.city || "",
      state: dealer.state || "",
      isActive: String(dealer.isActive),
    });
    setShowForm(true);
  };

  const deleteDealer = async (id: string) => {
    if (!confirm("Delete this dealer?")) return;
    try {
      await api.delete(`/dealers/${id}`);
      toast.success("Dealer deleted");
      loadDealers();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ name: "", company: "", email: "", phone: "", address: "", city: "", state: "", isActive: "true" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dealers</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <FiPlus /> Add Dealer
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm mb-6 space-y-4">
          <h2 className="font-semibold">{editingId ? "Edit Dealer" : "New Dealer"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" required placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
            <input type="text" placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
            <input type="tel" required placeholder="Phone *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
            <input type="text" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
            <input type="text" placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg">{editingId ? "Update" : "Create"}</button>
            <button type="button" onClick={resetForm} className="px-4 py-2 border rounded-lg">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Company</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">City</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dealers.map((dealer) => (
              <tr key={dealer.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{dealer.name}</td>
                <td className="px-4 py-3 text-gray-600">{dealer.company || "-"}</td>
                <td className="px-4 py-3">{dealer.phone}</td>
                <td className="px-4 py-3">{dealer.city || "-"}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${dealer.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {dealer.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => editDealer(dealer)} className="text-primary"><FiEdit2 size={16} /></button>
                    <button onClick={() => deleteDealer(dealer.id)} className="text-red-600"><FiTrash2 size={16} /></button>
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
