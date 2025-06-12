import { Data } from "./ingredients.repository";
import { UserDto } from "../../data/dto/user.dto";
import { User } from "../../data/models/user.model";
import FirebaseAuthManager from "../authentication/firebase.auth.manager";

export class UserRepositoryImpl {
  private url: string = "http://localhost:3000/users";

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
    const body: Data<UserDto> = await response.json();

    return {
      id: body.data._id,
      email: body.data.email,
      firstname: body.data.firstname,
      lastname: body.data.lastname,
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

    if (!response.ok) {
      throw new Error("Échec de la mise à jour de l’utilisateur");
    }

    const updatedUserData: Data<UserDto> = await response.json();
    return {
      id: updatedUserData.data._id,
      email: updatedUserData.data.email,
      firstname: updatedUserData.data.firstname,
      lastname: updatedUserData.data.lastname,
    };
  }
}
