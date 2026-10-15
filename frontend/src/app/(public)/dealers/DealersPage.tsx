"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { FiUser, FiPhone, FiMapPin, FiDownload, FiCheckCircle } from "react-icons/fi";

interface Dealer {
  id: string;
  name: string;
  company?: string;
  phone: string;
  city?: string;
  state?: string;
}

export default function DealersPage() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDealers();
  }, []);

  const loadDealers = async () => {
    try {
      const res = await api.get("/dealers/public");
      setDealers(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Authorized Dealers &amp; Distributors in Bihar</h1>

      <section className="mb-10 overflow-hidden rounded-2xl bg-[#101d33] text-white">
        <div className="relative p-6 sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,156,84,0.18),transparent_55%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff9c54]">Partner with Uniworld</p>
              <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">Become an authorized dealer</h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
                Join our dealer and distributor network across Bihar, Jharkhand, West Bengal, Odisha and Nepal.
                Download the credit application form, fill it in, and send it to our team along with your
                GST copy, PAN copy, Aadhaar copy and last 3 months' bank statement.
              </p>
              <ul className="mt-4 grid gap-2 text-sm text-slate-200 sm:grid-cols-2">
                {["Copy of GST number", "Copy of PAN", "Copy of Aadhaar", "Last 3 months bank statement"].map((doc) => (
                  <li key={doc} className="flex items-center gap-2"><FiCheckCircle size={15} className="shrink-0 text-[#ff9c54]" /> {doc}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6">
              <h3 className="text-lg font-bold">Dealer registration form</h3>
              <p className="mt-1.5 text-sm leading-6 text-slate-300">Credit application for a business account (PDF).</p>
              <a
                href="/downloads/dealer-registration-form.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#e31e24] px-5 text-sm font-bold text-white transition hover:bg-[#c9181d]"
              >
                <FiDownload size={16} /> Download and Submit
              </a>
              <p className="mt-3 text-xs leading-5 text-slate-400">
                Fill the form and share it with us — our team will review your application and get back to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {dealers.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No dealers listed yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {dealers.map((dealer) => (
            <div key={dealer.id} className="border rounded-lg p-6 hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <FiUser className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">{dealer.name}</h3>
                  {dealer.company && <p className="text-sm text-gray-500">{dealer.company}</p>}
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2"><FiPhone size={14} /> {dealer.phone}</p>
                {(dealer.city || dealer.state) && (
                  <p className="flex items-center gap-2"><FiMapPin size={14} /> {[dealer.city, dealer.state].filter(Boolean).join(", ")}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
