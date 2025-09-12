export interface TableDto {
  _id: string;
  number: number;
  capacity: number;
  isOccupied: boolean;
  dateOfCreation: string;
}

export interface CreateTableDto {
  number: number;
  capacity: number;
  isOccupied?: boolean;
}
