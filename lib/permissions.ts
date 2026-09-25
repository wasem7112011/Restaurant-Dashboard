import { Role } from "@/types";

type Action =
  | "products.write"
  | "products.delete"
  | "customers.write"
  | "customers.delete"
  | "orders.write"
  | "orders.delete"
  | "users.manage";

const permissions: Record<Action, Role[]> = {
  "products.write": ["admin", "manager"],
  "products.delete": ["admin", "manager"],
  "customers.write": ["admin", "manager", "staff"],
  "customers.delete": ["admin"],
  "orders.write": ["admin", "manager", "staff"],
  "orders.delete": ["admin", "manager"],
  "users.manage": ["admin"],
};

export function can(role: Role | undefined, action: Action) {
  if (!role) return false;
  return permissions[action].includes(role);
}
