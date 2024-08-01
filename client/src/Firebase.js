// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "mern-state-bc4dc.firebaseapp.com",
  projectId: "mern-state-bc4dc",
  storageBucket: "mern-state-bc4dc.appspot.com",
  messagingSenderId: "172559208688",
  appId: "1:172559208688:web:68275f15e5b7b14d5b3235",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
