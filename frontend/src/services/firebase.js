import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_KEY",
  projectId: "YOUR_ID",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);