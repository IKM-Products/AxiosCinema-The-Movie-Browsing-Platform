// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBfHc6wUDBXsU_oopR4Nl4rRKBhIhKpRug",
  authDomain: "axioscinema.firebaseapp.com",
  projectId: "axioscinema",
  storageBucket: "axioscinema.firebasestorage.app",
  messagingSenderId: "351165089669",
  appId: "1:351165089669:web:84b984c5c9dfadc33de6ec",
  measurementId: "G-9QCMTKDQPP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);