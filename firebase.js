// import firebase from "./firebase";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCcAqVQgN64kUODQbl4rK28O9PvJs7YR5c",
  authDomain: "chatsapp-6ed07.firebaseapp.com",
  projectId: "chatsapp-6ed07",
  storageBucket: "chatsapp-6ed07.appspot.com",
  messagingSenderId: "296964071585",
  appId: "1:296964071585:web:99b0bef71b6bf7f59bd0e0",
};

// Initialize Firebase
// const app = !firebase.apps.length
//   ? initializeApp(firebaseConfig)
//   : firebase.app;
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
// const signInWithPopup = signInWithPopup(provider).catch(alert);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
