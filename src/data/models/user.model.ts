export type UserRole =
  | "CUSTOMER"
  | "WAITER"
  | "KITCHEN_STAFF"
  | "MANAGER"
  | "OWNER"
  | "ADMIN";

export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  role: UserRole;
}
