"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { DollarSign, ShoppingCart, Package, Users } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface Overview {
  orderCount: number;
  productCount: number;
  customerCount: number;
  revenue: number;
  statusCounts: Record<string, number>;
}

interface RevenuePoint {
  _id: string;
  revenue: number;
  orders: number;
}

const COLORS = ["#f97316", "#3b82f6", "#8b5cf6", "#10b981", "#ef4444"];

export default function DashboardPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [revenue, setRevenue] = useState<RevenuePoint[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const [ov, rev, orders] = await Promise.all([
        api.get("/stats/overview"),
        api.get("/stats/revenue-by-day?days=14"),
        api.get("/orders?limit=5&sort=newest"),
      ]);
      setOverview(ov.data);
      setRevenue(rev.data.data);
      setRecentOrders(orders.data.items);
    }
    load();
  }, []);

  const statusData = overview
    ? Object.entries(overview.statusCounts).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue"
          value={overview ? `EGP ${overview.revenue.toLocaleString()}` : "..."}
          icon={DollarSign}
          color="bg-emerald-500"
        />
        <StatCard
          label="Orders"
          value={overview?.orderCount ?? "..."}
          icon={ShoppingCart}
          color="bg-brand-500"
        />
        <StatCard
          label="Products"
          value={overview?.productCount ?? "..."}
          icon={Package}
          color="bg-blue-500"
        />
        <StatCard
          label="Customers"
          value={overview?.customerCount ?? "..."}
          icon={Users}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Revenue - last 14 days</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenue}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#f97316" fill="url(#rev)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Order status</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85}>
                {statusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700">Recent orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="text-left px-5 py-3">Order</th>
                <th className="text-left px-5 py-3">Customer</th>
                <th className="text-left px-5 py-3">Total</th>
                <th className="text-left px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o._id} className="border-t border-slate-100">
                  <td className="px-5 py-3 font-medium text-slate-700">{o.orderNumber}</td>
                  <td className="px-5 py-3 text-slate-600">{o.customer?.name || "-"}</td>
                  <td className="px-5 py-3 text-slate-600">EGP {o.total}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-slate-400">
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
