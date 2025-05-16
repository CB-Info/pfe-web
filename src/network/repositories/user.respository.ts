import { Data } from "./ingredients.repository";
import { UserDto } from "../../data/dto/user.dto";
import { User } from "../../data/models/user.model";
import FirebaseAuthManager from "../authentication/firebase.auth.manager";

export class UserRepositoryImpl {
    private url: string = "https://pfe-api-fbyd.onrender.com/users";
    private cache: Map<string, { data: any, timestamp: number }> = new Map();
    private cacheTimeout = 5 * 60 * 1000; // 5 minutes

    private async getFromCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
        const now = Date.now();
        const cached = this.cache.get(key);

        if (cached && (now - cached.timestamp) < this.cacheTimeout) {
            return cached.data as T;
        }

        const data = await fetcher();
        this.cache.set(key, { data, timestamp: now });
        return data;
    }

    private clearCache() {
        this.cache.clear();
    }

    async login(email: string, password: string) {
        await FirebaseAuthManager.getInstance().login(email, password);
    }

    async getMe(): Promise<User> {
        const cacheKey = 'current-user';
        
        return this.getFromCache(cacheKey, async () => {
            const token = await FirebaseAuthManager.getInstance().getToken();

            const response = await fetch(`${this.url}/me`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                }
            });
            const body: Data<UserDto> = await response.json();

            return {
                id: body.data._id,
                email: body.data.email,
                firstname: body.data.firstname,
                lastname: body.data.lastname
            };
        });
    }

    async updateUser(userId: string, updateUser: UserDto): Promise<User> {
        const token = await FirebaseAuthManager.getInstance().getToken();
        const response = await fetch(`${this.url}/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updateUser)
        });

        if (!response.ok) {
            throw new Error("Échec de la mise à jour de l'utilisateur");
            )
        }

        const updatedUserData: Data<UserDto> = await response.json();
        this.clearCache();

        return {
            id: updatedUserData.data._id,
            email: updatedUserData.data.email,
            firstname: updatedUserData.data.firstname,
            lastname: updatedUserData.data.lastname
        };
    }
}