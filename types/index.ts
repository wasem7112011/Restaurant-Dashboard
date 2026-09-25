export type Role = "admin" | "manager" | "staff";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
}

export interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
  status: "active" | "inactive";
  description?: string;
  createdAt: string;
}

export interface Customer {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  status: "active" | "blocked";
  createdAt: string;
}

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: Customer | string;
  items: OrderItem[];
  total: number;
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
  paymentStatus: "paid" | "unpaid";
  notes?: string;
  createdAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListResponse<T> {
  items: T[];
  meta: PaginationMeta;
}
