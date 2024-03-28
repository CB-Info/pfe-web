// src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebaseConfig from './credentials.json';

// Initialisez Firebase
const app = initializeApp(firebaseConfig);

// Initialisez et exportez l'authentification Firebase
export const auth = getAuth(app);
