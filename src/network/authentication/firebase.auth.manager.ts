import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User, Auth } from "firebase/auth";

// Firebase configuration using environment variables with fallbacks
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-app-id"
};

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