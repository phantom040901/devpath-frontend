// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getDatabase } from "firebase/database";

// Get env variables - works in both browser (Vite) and Node.js
const getEnv = (key) => {
  // Browser environment with Vite
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key];
  }
  // Node.js environment
  return process.env[key];
};

const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VITE_FIREBASE_APP_ID'),
  measurementId: getEnv('VITE_FIREBASE_MEASUREMENT_ID'),
  databaseURL: getEnv('VITE_FIREBASE_DATABASE_URL') || `https://${getEnv('VITE_FIREBASE_PROJECT_ID')}-default-rtdb.firebaseio.com`,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export const realtimeDb = getDatabase(app);

// Optional: connect to Functions Emulator in dev
/*
if (import.meta.env.DEV) {
  connectFunctionsEmulator(functions, "localhost", 5001);
  console.log("🔧 Connected to Functions Emulator");
}
*/

export default app;
