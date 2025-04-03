// Firebase Service Configuration
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDENxDBC_MXu19-PlLuXgRReGBbwQFi6BI",
  authDomain: "update-life-app-b07dd.firebaseapp.com",
  projectId: "update-life-app-b07dd",
  storageBucket: "update-life-app-b07dd.firebasestorage.app",
  messagingSenderId: "706047234654",
  appId: "1:706047234654:web:db9bec078b54b518e7dacf",
  measurementId: "G-D032LD4VP2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { app, auth, db, storage, analytics };
