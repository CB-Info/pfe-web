import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User, Auth } from "firebase/auth";
import firebaseConfig from '../../credentials.json';

const app = initializeApp(firebaseConfig);

class FirebaseAuthManager {
    private static instance: FirebaseAuthManager;
    private auth: Auth;

    private constructor() {
        this.auth = getAuth(app);
    }

    public static getInstance(): FirebaseAuthManager {
        if (!FirebaseAuthManager.instance) {
            FirebaseAuthManager.instance = new FirebaseAuthManager();
        }
        return FirebaseAuthManager.instance;
    }

    async login(email: string, password: string): Promise<User | null> {
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error("Erreur de connexion: ", error);
            throw error;
        }
    }

    async sendPasswordResetEmail(email: string): Promise<void> {
        try {
            const { sendPasswordResetEmail } = await import("firebase/auth");
            await sendPasswordResetEmail(this.auth, email);
        } catch (error) {
            console.error("Erreur lors de l'envoi de l'email de réinitialisation: ", error);
            throw error;
        }
    }

    async getToken(): Promise<string | null> {
        if (this.auth.currentUser) {
            return this.auth.currentUser.getIdToken();
        } else {
            throw new Error("Aucun utilisateur connecté");
        }
    }

    async logout(): Promise<void> {
        try {
            await signOut(this.auth);
        } catch (error) {
            console.error("Erreur de déconnexion: ", error);
        }
    }

    monitorAuthState(callback: (user: User | null) => void): () => void {
        const unsubscribe = onAuthStateChanged(this.auth, callback);
        return unsubscribe;
    }
}

export default FirebaseAuthManager;