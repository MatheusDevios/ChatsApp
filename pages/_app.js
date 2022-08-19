import "../styles/globals.css";
import Login from "./login";
import { useAuthState } from "react-firebase-hooks/auth";
import Loading from "../components/Loading";
import { useEffect } from "react";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      setDoc(doc(db, "users", user.uid), {
        username: user.displayName,
        email: user.email,
        lastSeen: user.metadata.lastSignInTime,
        profilePicture: user.photoURL,
      });
    }
  }, [user]);

  if (loading) return <Loading />;
  if (!user) return <Login />;

  return <Component {...pageProps} />;
}

export default MyApp;
