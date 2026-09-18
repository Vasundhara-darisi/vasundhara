import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAJkM7X4VNqueoD34-ztp930vBSoBc4eNg",
  authDomain: "timepass-ce62c.firebaseapp.com",
  projectId: "timepass-ce62c",
  storageBucket: "timepass-ce62c.firebasestorage.app",
  messagingSenderId: "606659498062",
  appId: "1:606659498062:web:603c81357fe784f619b31f",
  measurementId: "G-E53KBM5LXL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, doc, getDoc, setDoc };
