import { TableDto, CreateTableDto } from "../../data/dto/table.dto";
import { Table } from "../../data/models/table.model";
import FirebaseAuthManager from "../authentication/firebase.auth.manager";
import { Data } from "./ingredients.repository";
import { handleApiResponse } from "../../utils/api.utils";

export class TablesRepositoryImpl {
  private url: string = `${import.meta.env.VITE_API_BASE_URL}/tables`;

  async getAll(): Promise<Table[]> {
    const token = await FirebaseAuthManager.getInstance().getToken();
    const response = await fetch(this.url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    await handleApiResponse(response);
    const data: Data<TableDto[]> = await response.json();
    return data.data.map((table) => Table.fromDto(table));
  }

  async getById(tableId: string): Promise<Table> {
    const token = await FirebaseAuthManager.getInstance().getToken();
    const response = await fetch(`${this.url}/${tableId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    await handleApiResponse(response);
    const data: Data<TableDto> = await response.json();
    return Table.fromDto(data.data);
  }

  async create(newTable: CreateTableDto): Promise<Table> {
    const token = await FirebaseAuthManager.getInstance().getToken();
    const response = await fetch(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newTable),
    });

    await handleApiResponse(response);
    const data: Data<TableDto> = await response.json();
    return Table.fromDto(data.data);
  }

  async updateOccupiedStatus(
    tableId: string,
    isOccupied: boolean
  ): Promise<Table> {
    const token = await FirebaseAuthManager.getInstance().getToken();
    const response = await fetch(`${this.url}/${tableId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isOccupied }),
    });

    await handleApiResponse(response);
    const data: Data<TableDto> = await response.json();
    return Table.fromDto(data.data);
  }
}
