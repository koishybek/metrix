// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQrzqAi86fVhbntzzTNVdX9svJftgfYYw",
  authDomain: "metrix-d902d.firebaseapp.com",
  projectId: "metrix-d902d",
  storageBucket: "metrix-d902d.firebasestorage.app",
  messagingSenderId: "358273507422",
  appId: "1:358273507422:web:96a05095e819ab65f154cf",
  measurementId: "G-YPJX08G65Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Analytics only if supported (it fails in some environments)
const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

export { db, analytics };
