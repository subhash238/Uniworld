"use client";

import { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { FiPhone, FiMail, FiMapPin, FiSend } from "react-icons/fi";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/contact", form);
      toast.success("Message sent successfully! We will get back to you soon.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Contact Uniworld - Bihar&apos;s Trusted Security Partner</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-orange-50 p-6 rounded-lg">
            <FiPhone className="text-primary mb-3" size={24} />
            <h3 className="font-semibold mb-1">Phone</h3>
            <p className="text-gray-600">+91 73600 00121</p>
          </div>
          <div className="bg-orange-50 p-6 rounded-lg">
            <FiMail className="text-primary mb-3" size={24} />
            <h3 className="font-semibold mb-1">Email</h3>
            <p className="text-gray-600">info@uniworldvision.com</p>
          </div>
          <div className="bg-orange-50 p-6 rounded-lg">
            <FiMapPin className="text-primary mb-3" size={24} />
            <h3 className="font-semibold mb-1">Address</h3>
            <p className="text-gray-600">Uniworld Headoffice :Road no 3 Azad Nagar Kankarbagh Patna 800020</p>
            <p className="text-gray-600">Delhi Office :Road no 3 Azad Nagar Kankarbagh Patna 800020</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name *"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email Address *"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="tel"
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <input
                type="text"
                placeholder="Subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <textarea
              placeholder="Your Message *"
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none resize-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              <FiSend /> {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
