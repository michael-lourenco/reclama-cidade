import {  doc, setDoc, updateDoc, Firestore } from "firebase/firestore";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { fetchUserData } from "../firebase/FirebaseService";
import { StoryEntry, Credit } from "@/application/entities/User";

export interface Round {
  dice_1: number;
  dice_2: number;
  dice_3: number;
  choosed_value: number;
  time: number;
  success: boolean;
  errors: number;
  createdAt: Date;
}

interface MatchHistoryEntry {
  id: number;
  date: Date;
  score: number;
  errors: number;
  duration: string;
  rounds: Round[];
}

interface BestScoreData {
  value: number;
  updatedAt: Date;
}

interface CurrencyData {
  value: number;
  updatedAt: Date;
}
interface TotalGamesData {
  value: number;
  updatedAt: Date;
}

interface UserData {
  displayName: string;
  best_score: BestScoreData;
  currency: CurrencyData;
  total_games: TotalGamesData;
  credits: Credit;
  email: string;
  story?: StoryEntry[];
  match_history?: MatchHistoryEntry[];
  photoURL: string;
}

let globalUser: UserData | null = null;

async function signInWithGoogle(): Promise<void> {
  try {
    await signIn("google", { callbackUrl: "/player" });
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
        best_score: { value: 0, updatedAt: new Date() },
        currency: { value: 0, updatedAt: new Date() },
        story: [],
        total_games: { value: 0, updatedAt: new Date() },
        match_history: [],
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

export type { UserData, MatchHistoryEntry };
