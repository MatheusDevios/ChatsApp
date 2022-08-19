import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDOSl82V7iiOs6Ax7Y7lDh5B5cQe377Nuc",
  authDomain: "chatsapp-68ecd.firebaseapp.com",
  databaseURL:
    "https://chatsapp-68ecd-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "chatsapp-68ecd",
  storageBucket: "chatsapp-68ecd.appspot.com",
  messagingSenderId: "293962154485",
  appId: "1:293962154485:web:9f5fe7db0879b6ddb9e0bc",
};

let app;
// Initialize Firebase
if (!app) {
  app = initializeApp(firebaseConfig);
} else {
  app(); // if already initialized, use that one
}

const db = getFirestore();

const auth = getAuth();
const provider = new GoogleAuthProvider();

export { auth, provider, db };
