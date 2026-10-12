"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { FiUser, FiPhone, FiMapPin } from "react-icons/fi";

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
