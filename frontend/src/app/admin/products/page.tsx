"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiCamera } from "react-icons/fi";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  images: { url: string }[];
  category: { name: string };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadProducts();
  }, [page]);

  const loadProducts = async () => {
    try {
      const res = await api.get(`/products?page=${page}&limit=20`);
      setProducts(res.data.products);
      setTotalPages(res.data.pagination.pages);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      loadProducts();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/new" className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <FiPlus /> Add Product
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left">Image</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Stock</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 relative bg-gray-100 rounded">
                        {product.images[0] ? (
                          <Image src={product.images[0].url} alt="" fill className="object-cover rounded" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><FiCamera className="text-gray-300" /></div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{product.name}</td>
                    <td className="px-4 py-3 text-gray-600">{product.category.name}</td>
                    <td className="px-4 py-3">₹{product.price.toLocaleString()}</td>
                    <td className="px-4 py-3">{product.stock}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${product.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                      {product.isFeatured && (
                        <span className="ml-1 px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-700">Featured</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/products/${product.id}`} className="text-primary hover:text-primary-dark">
                          <FiEdit2 size={16} />
                        </Link>
                        <button onClick={() => deleteProduct(product.id, product.name)} className="text-red-600 hover:text-red-800">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 p-4 border-t">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
              <span className="px-3 py-1">Page {page} of {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
