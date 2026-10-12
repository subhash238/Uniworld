"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { FiEye, FiTrash2 } from "react-icons/fi";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: { product: { name: string }; quantity: number }[];
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-orange-100 text-primary",
  processing: "bg-purple-100 text-purple-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data.orders);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      toast.success("Status updated");
      loadOrders();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Delete this order?")) return;
    try {
      await api.delete(`/orders/${id}`);
      toast.success("Order deleted");
      loadOrders();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Order #</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{order.orderNumber}</td>
                  <td className="px-4 py-3">
                    <div>{order.customerName}</div>
                    <div className="text-xs text-gray-500">{order.customerPhone}</div>
                  </td>
                  <td className="px-4 py-3 font-medium">₹{order.totalAmount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded ${statusColors[order.status] || ""}`}
                    >
                      {["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelectedOrder(order)} className="text-primary"><FiEye size={16} /></button>
                      <button onClick={() => deleteOrder(order.id)} className="text-red-600"><FiTrash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Order: {selectedOrder.orderNumber}</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
              <p><strong>Phone:</strong> {selectedOrder.customerPhone}</p>
              <p><strong>Total:</strong> ₹{selectedOrder.totalAmount.toLocaleString()}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <h3 className="font-semibold mt-4">Items:</h3>
              <ul className="list-disc pl-5">
                {selectedOrder.items.map((item, i) => (
                  <li key={i}>{item.product.name} x {item.quantity}</li>
                ))}
              </ul>
            </div>
            <button onClick={() => setSelectedOrder(null)} className="mt-4 px-4 py-2 bg-gray-100 rounded-lg">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
