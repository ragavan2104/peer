// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDc_SYKlyMLHtidREPm1gP7mBxBBefw16I",
  authDomain: "peer-b5111.firebaseapp.com",
  projectId: "peer-b5111",
  storageBucket: "peer-b5111.firebasestorage.app",
  messagingSenderId: "147085389719",
  appId: "1:147085389719:web:4c659f1c5364670df41ed2",
  measurementId: "G-F7ZSY6944V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
