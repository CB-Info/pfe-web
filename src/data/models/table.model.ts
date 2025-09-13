import { TableDto } from "../dto/table.dto";

export class Table {
  _id: string;
  number: number;
  capacity: number;
  isOccupied: boolean;
  dateOfCreation: string;

  constructor(
    _id: string,
    number: number,
    capacity: number,
    isOccupied: boolean,
    dateOfCreation: string
  ) {
    this._id = _id;
    this.number = number;
    this.capacity = capacity;
    this.isOccupied = isOccupied;
    this.dateOfCreation = dateOfCreation;
  }

  static fromDto(dto: TableDto): Table {
    return new Table(
      dto._id,
      dto.number,
      dto.capacity,
      dto.isOccupied,
      dto.dateOfCreation
    );
  }
}
