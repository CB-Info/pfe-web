import { OrderDto, OrderStatus, OrderDishDto } from "../dto/order.dto";

export class OrderDish {
  dishId: string;
  isPaid: boolean;

  constructor(dishId: string, isPaid: boolean) {
    this.dishId = dishId;
    this.isPaid = isPaid;
  }

  static fromDto(dto: OrderDishDto): OrderDish {
    return new OrderDish(dto.dishId, dto.isPaid);
  }
}

export class Order {
  _id: string;
  tableNumberId: string;
  dishes: OrderDish[];
  status: OrderStatus;
  totalPrice: number;
  tips: number;
  dateOfCreation: string;
  waiterId?: string;

  constructor(
    _id: string,
    tableNumberId: string,
    dishes: OrderDish[],
    status: OrderStatus,
    totalPrice: number,
    tips: number,
    dateOfCreation: string,
    waiterId?: string
  ) {
    this._id = _id;
    this.tableNumberId = tableNumberId;
    this.dishes = dishes;
    this.status = status;
    this.totalPrice = totalPrice;
    this.tips = tips;
    this.dateOfCreation = dateOfCreation;
    this.waiterId = waiterId;
  }

  static fromDto(dto: OrderDto): Order {
    const dishes = dto.dishes.map((dish) => OrderDish.fromDto(dish));
    return new Order(
      dto._id,
      dto.tableNumberId,
      dishes,
      dto.status,
      dto.totalPrice,
      dto.tips,
      dto.dateOfCreation,
      dto.waiterId
    );
  }
}
