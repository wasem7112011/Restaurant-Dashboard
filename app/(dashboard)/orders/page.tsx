"use client";

import { useEffect, useState, FormEvent } from "react";
import api from "@/lib/api";
import { Order, Customer, Product, ListResponse } from "@/types";
import Modal from "@/components/Modal";
import Pagination from "@/components/Pagination";
import StatusBadge from "@/components/StatusBadge";
import { useAuth } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { Plus, Trash2, Search, X } from "lucide-react";

interface DraftItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
}

const statuses = ["pending", "preparing", "ready", "completed", "cancelled"];

export default function OrdersPage() {
  const { user } = useAuth();
  const [data, setData] = useState<ListResponse<Order> | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [items, setItems] = useState<DraftItem[]>([]);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await api.get("/orders", { params: { search, status, page, limit: 8 } });
    setData(res.data);
  }

  useEffect(() => {
    load();
  }, [search, status, page]);

  async function openCreate() {
    setItems([]);
    setCustomerId("");
    setSelectedProduct("");
    const [c, p] = await Promise.all([
      api.get("/customers", { params: { limit: 100 } }),
      api.get("/products", { params: { limit: 100, status: "active" } }),
    ]);
    setCustomers(c.data.items);
    setProducts(p.data.items);
    setModalOpen(true);
  }

  function addItem() {
    if (!selectedProduct) return;
    const p = products.find((pr) => pr._id === selectedProduct);
    if (!p) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.product === p._id);
      if (existing) {
        return prev.map((i) => (i.product === p._id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { product: p._id, name: p.name, price: p.price, quantity: 1 }];
    });
  }

  function updateQty(productId: string, qty: number) {
    setItems((prev) => prev.map((i) => (i.product === productId ? { ...i, quantity: Math.max(qty, 1) } : i)));
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((i) => i.product !== productId));
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!customerId || items.length === 0) return;
    setSaving(true);
    try {
      await api.post("/orders", {
        customer: customerId,
        items: items.map((i) => ({ product: i.product, quantity: i.quantity })),
      });
      setModalOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(order: Order, newStatus: string) {
    await api.put(`/orders/${order._id}`, { status: newStatus });
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this order?")) return;
    await api.delete(`/orders/${id}`);
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Search order number..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
            className="text-sm rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {can(user?.role, "orders.write") && (
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            <Plus size={16} /> New order
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="text-left px-5 py-3">Order</th>
                <th className="text-left px-5 py-3">Customer</th>
                <th className="text-left px-5 py-3">Total</th>
                <th className="text-left px-5 py-3">Payment</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((o) => (
                <tr key={o._id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium text-slate-700">{o.orderNumber}</td>
                  <td className="px-5 py-3 text-slate-600">{(o.customer as Customer)?.name || "-"}</td>
                  <td className="px-5 py-3 text-slate-600">EGP {o.total}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={o.paymentStatus} />
                  </td>
                  <td className="px-5 py-3">
                    {can(user?.role, "orders.write") ? (
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o, e.target.value)}
                        className="text-xs rounded-lg border border-slate-200 px-2 py-1.5 capitalize"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <StatusBadge status={o.status} />
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      {can(user?.role, "orders.delete") && (
                        <button onClick={() => handleDelete(o._id)} className="text-slate-400 hover:text-red-600">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {data && data.items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {data && <Pagination meta={data.meta} onPageChange={setPage} />}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New order">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Customer</label>
            <select
              required
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">Select customer</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} - {c.phone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Add item</label>
            <div className="flex gap-2">
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">Select product</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} - EGP {p.price}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={addItem}
                className="bg-slate-800 text-white text-sm px-3 rounded-lg hover:bg-slate-900"
              >
                Add
              </button>
            </div>
          </div>

          {items.length > 0 && (
            <div className="border border-slate-200 rounded-lg divide-y divide-slate-100">
              {items.map((i) => (
                <div key={i.product} className="flex items-center justify-between px-3 py-2 text-sm">
                  <span className="text-slate-700">{i.name}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      value={i.quantity}
                      onChange={(e) => updateQty(i.product, Number(e.target.value))}
                      className="w-14 rounded border border-slate-300 px-1.5 py-1 text-xs"
                    />
                    <span className="text-slate-500 w-16 text-right">EGP {i.price * i.quantity}</span>
                    <button type="button" onClick={() => removeItem(i.product)} className="text-slate-400 hover:text-red-600">
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between px-3 py-2 text-sm font-semibold bg-slate-50">
                <span>Total</span>
                <span>EGP {total}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={saving || items.length === 0 || !customerId}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg py-2.5 disabled:opacity-60"
          >
            {saving ? "Placing order..." : "Place order"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
