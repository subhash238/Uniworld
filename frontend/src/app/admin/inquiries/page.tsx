"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { FiMail, FiTrash2, FiCheck } from "react-icons/fi";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Inquiry | null>(null);

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    try {
      const res = await api.get("/contact");
      setInquiries(res.data.inquiries);
    } catch (error) {
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/contact/${id}/read`);
      loadInquiries();
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    try {
      await api.delete(`/contact/${id}`);
      toast.success("Deleted");
      loadInquiries();
      if (selected?.id === id) setSelected(null);
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Contact Inquiries</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="divide-y">
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                onClick={() => { setSelected(inq); if (!inq.isRead) markAsRead(inq.id); }}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${!inq.isRead ? "bg-orange-50" : ""} ${selected?.id === inq.id ? "border-l-4 border-primary" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {!inq.isRead && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                    <span className="font-medium text-sm">{inq.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(inq.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{inq.subject || "No subject"}</p>
                <p className="text-xs text-gray-400 mt-1 truncate">{inq.message}</p>
              </div>
            ))}
            {inquiries.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <FiMail size={32} className="mx-auto mb-2" />
                <p>No inquiries yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {selected ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold">Message Details</h2>
                <button onClick={() => deleteInquiry(selected.id)} className="text-red-600"><FiTrash2 size={16} /></button>
              </div>
              <div className="space-y-3 text-sm">
                <p><strong>Name:</strong> {selected.name}</p>
                <p><strong>Email:</strong> {selected.email}</p>
                {selected.phone && <p><strong>Phone:</strong> {selected.phone}</p>}
                {selected.subject && <p><strong>Subject:</strong> {selected.subject}</p>}
                <div>
                  <strong>Message:</strong>
                  <p className="mt-1 text-gray-600 whitespace-pre-line">{selected.message}</p>
                </div>
                <p className="text-xs text-gray-400">Received: {new Date(selected.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-10">
              <FiMail size={32} className="mx-auto mb-2" />
              <p className="text-sm">Select an inquiry to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
