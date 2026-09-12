// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "alexai-81a3a.firebaseapp.com",
  projectId: "alexai-81a3a",
  storageBucket: "alexai-81a3a.firebasestorage.app",
  messagingSenderId: "428436672505",
  appId: "1:428436672505:web:31c2f70aa66b4ab950b728",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// initialize others things
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
