export enum OrderStatus {
  PENDING = "PENDING",
  IN_PREPARATION = "IN_PREPARATION",
  READY = "READY",
  DELIVERED = "DELIVERED",
  FINISH = "FINISH",
  CANCELLED = "CANCELLED",
}

export const OrderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "En attente",
  [OrderStatus.IN_PREPARATION]: "En préparation",
  [OrderStatus.READY]: "Prêt",
  [OrderStatus.DELIVERED]: "Servi",
  [OrderStatus.FINISH]: "Payé",
  [OrderStatus.CANCELLED]: "Annulé",
};

export interface OrderDishDto {
  dishId: string;
  isPaid: boolean;
}

export interface OrderDto {
  _id: string;
  tableNumberId: string;
  dishes: OrderDishDto[];
  status: OrderStatus;
  totalPrice: number;
  tips: number;
  dateOfCreation: string;
  waiterId?: string;
}

export interface CreateOrderDto {
  tableNumberId: string;
  dishes: OrderDishDto[];
  status: OrderStatus;
  totalPrice: number;
  tips: number;
}

export interface UpdateOrderDto {
  _id: string;
  status?: OrderStatus;
  totalPrice?: number;
  tips?: number;
  dishes?: OrderDishDto[];
}
