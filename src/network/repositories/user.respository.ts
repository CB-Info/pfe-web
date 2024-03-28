import { auth } from "../../firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Data } from "./ingredients.repository";
import { UserDto } from "../../dto/user.dto";
import { User } from "../../models/user.model";

export class UserRepositoryImpl {
    private url: string = "http://localhost:3000/users";

    async login(email: string, password: string): Promise<User> {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();

        const response = await fetch(`${this.url}/me`, {
            method: "GET",
            headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
            }
        })
        const body: Data<UserDto> = await response.json()

        console.log(body.data)

        return {
            id: body.data._id,
            email: body.data.email,
            firstname: body.data.firstname,
            lastname: body.data.lastname
        }
    }

}