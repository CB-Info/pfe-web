import FirebaseAuthManager from "../authentication/firebase.auth.manager";
import { handleApiResponse } from "../../utils/api.utils";

// Types pour les différentes sections
export interface DashboardStats {
  totalDishes: number;
  availableDishes: number;
  totalCards: number;
  activeCards: number;
  averagePrice: number;
  categoryDistribution: Array<{ category: string; count: number }>;
  topIngredients: Array<{ name: string; count: number }>;
}

export interface ManagerStats {
  totalEmployees: number;
  activeEmployees: number;
  dailyRevenue: number;
  ordersToday: number;
  averageServiceTime: number;
  customerSatisfaction: number;
}

export interface KitchenStats {
  ordersInPreparation: number;
  completedToday: number;
  lowStockItems: number;
  averagePreparationTime: number;
}

export interface WaiterStats {
  tablesAssigned: number;
  activeOrders: number;
  completedOrders: number;
  pendingOrders: number;
}

export interface CustomerStats {
  myOrders: number;
  favoriteCategory: string;
  lastOrderTime: string;
  loyaltyPoints: number;
}

export interface DashboardDish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  status: "active" | "break" | "offline";
  tablesAssigned?: number;
}

export interface StockItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  status: "good" | "medium" | "low";
  threshold: number;
}

export interface Table {
  id: string;
  number: number;
  status: "occupied" | "available" | "reserved";
  orderCount: number;
  lastOrderTime: string | null;
}

export interface CustomerOrder {
  id: string;
  date: string;
  items: string[];
  total: number;
  status: string;
}

export interface OwnerSection {
  stats: DashboardStats;
  recentDishes: DashboardDish[];
}

export interface ManagerSection {
  stats: ManagerStats;
  employees: Employee[];
}

export interface KitchenSection {
  stats: KitchenStats;
  stock: StockItem[];
}

export interface WaiterSection {
  stats: WaiterStats;
  tables: Table[];
}

export interface CustomerSection {
  stats: CustomerStats;
  recentOrders: CustomerOrder[];
}

export interface DashboardResponse {
  userRole: string;
  sections: {
    owner?: OwnerSection;
    manager?: ManagerSection;
    kitchen?: KitchenSection;
    waiter?: WaiterSection;
    customer?: CustomerSection;
  };
}

export interface DashboardApiResponse {
  error: string | null;
  data: DashboardResponse;
}

export class DashboardRepositoryImpl {
  private url: string = `${import.meta.env.VITE_API_BASE_URL}/dashboard`;

  async getDashboardData(): Promise<DashboardResponse> {
    const token = await FirebaseAuthManager.getInstance().getToken();
    const response = await fetch(this.url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    await handleApiResponse(response);
    const body: DashboardApiResponse = await response.json();
    return body.data;
  }
}
