import { UserRole } from "../models/user.model";

export interface UserDto {
  _id: string;
  email: string;
  firstname: string;
  lastname: string;
  role: UserRole;
}
