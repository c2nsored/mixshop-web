import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Replace with your actual Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgHltO02u8mjzqYudFrXL9sOcLYoLqAfo",
  authDomain: "mixshop-jp.firebaseapp.com",
  projectId: "mixshop-jp",
  storageBucket: "mixshop-jp.firebasestorage.app",
  messagingSenderId: "1034024388578",
  appId: "1:1034024388578:web:d5be1881a9e263a7389bbb",
  measurementId: "G-WRXXCJPZYR"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
