import { Data } from "./ingredients.repository";
import { UserDto } from "../../data/dto/user.dto";
import { User } from "../../data/models/user.model";
import FirebaseAuthManager from "../authentication/firebase.auth.manager";
import { handleApiResponse } from "../../utils/api.utils";
import { mapBackendRoleToFrontend } from "../../utils/role.utils";

export class UserRepositoryImpl {
  private url: string = `${import.meta.env.VITE_API_BASE_URL}/users`;

  async login(email: string, password: string) {
    await FirebaseAuthManager.getInstance().login(email, password);
  }

  async getMe(): Promise<User> {
    const token = await FirebaseAuthManager.getInstance().getToken();

    const response = await fetch(`${this.url}/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    await handleApiResponse(response);
    const body: Data<UserDto> = await response.json();

    // Gestion défensive : si le backend n'expose pas encore le rôle
    const backendRole = (body.data as any).role || "customer";

    // Mapper les rôles du backend (minuscules) vers le frontend (majuscules)
    const role = mapBackendRoleToFrontend(backendRole);

    return {
      id: body.data._id,
      email: body.data.email,
      firstname: body.data.firstname,
      lastname: body.data.lastname,
      role: role,
    };
  }

  async updateUser(userId: string, updateUser: UserDto): Promise<User> {
    const token = await FirebaseAuthManager.getInstance().getToken();
    const response = await fetch(`${this.url}/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateUser),
    });

    await handleApiResponse(response);
    const updatedUserData: Data<UserDto> = await response.json();

    return {
      id: updatedUserData.data._id,
      email: updatedUserData.data.email,
      firstname: updatedUserData.data.firstname,
      lastname: updatedUserData.data.lastname,
      role: updatedUserData.data.role || "CUSTOMER",
    };
  }
}
