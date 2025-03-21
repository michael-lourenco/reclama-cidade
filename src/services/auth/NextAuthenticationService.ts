import {  doc, setDoc, updateDoc, Firestore } from "firebase/firestore";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { fetchUserData } from "../firebase/FirebaseService";
import { Credit } from "@/application/entities/User";

interface CurrencyData {
  value: number;
  updatedAt: Date;
}

interface UserData {
  displayName: string;
  currency: CurrencyData;
  credits: Credit;
  email: string;
  photoURL: string;
}

let globalUser: UserData | null = null;

async function signInWithGoogle(): Promise<void> {
  try {
    await signIn("google", { callbackUrl: "/user" });
  } catch (error) {
    console.error("Error during sign in:", error);
    throw error;
  }
}

async function signOutUser(): Promise<void> {
  try {
    await signOut({ callbackUrl: "/" });
    localStorage.removeItem("user");
    globalUser = null;
  } catch (error) {
    console.error("Error during sign out:", error);
    throw error;
  }
}

async function handleAuthResponse(session: Session | null, db: Firestore): Promise<UserData | null> {
  if (!session?.user?.email) return null;

  try {
    const email = session.user.email;
    let userData = await fetchUserData(db, email);

    if (!userData) {
      userData = {
        displayName: session.user.name || "",
        email: email,
        photoURL: session.user.image || "",
        credits: { value: 0, updatedAt: new Date() },
        currency: { value: 0, updatedAt: new Date() },
      };

      const userRef = doc(db, process.env.NEXT_PUBLIC_USERS_COLLECTION!, email);
      await setDoc(userRef, userData);
    }

    if (session.user.image && userData.photoURL !== session.user.image) {
      const userRef = doc(db, process.env.NEXT_PUBLIC_USERS_COLLECTION!, email);
      await updateDoc(userRef, { photoURL: session.user.image });
      userData.photoURL = session.user.image;
    }

    globalUser = userData;
    localStorage.setItem("user", JSON.stringify(userData));
    return userData;
  } catch (error) {
    console.error("Error handling auth response:", error);
    return null;
  }
}

export {
  signInWithGoogle,
  signOutUser as signOutFromGoogle,
  handleAuthResponse,
};

export type { UserData };
