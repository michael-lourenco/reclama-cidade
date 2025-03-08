import { collection, getFirestore, doc, getDoc, getDocs, setDoc, updateDoc, Firestore, DocumentSnapshot, DocumentData } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence, Auth } from "firebase/auth";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { StoryEntry } from "@/application/entities/User";
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

interface BestScore {
  value: number;
  updatedAt: Date;
}

interface Credit {
  value: number;
  updatedAt: Date;
}
interface Currency {
  value: number;
  updatedAt: Date;
}
interface FirestoreUser {
  id: string;
  displayName: string;
  email: string;
  best_score?: BestScore;
  currency?: Currency;
}
interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  date: Date;
}

interface LeaderboardPayload {
  id: string;
  name: string;
  owner: string;
  description: string;
  leaderboard: LeaderboardEntry[];
  date: string;
  type: string;
}
interface TotalGamesData {
  value: number;
  updatedAt: Date;
}

interface Votes {
  [key: string]: string;
}

interface UserData {
  displayName: string;
  best_score: BestScoreData;
  credits: Credit;
  currency: CurrencyData;
  total_games: TotalGamesData;
  email: string;
  story?: StoryEntry[];
  match_history?: MatchHistoryEntry[];
  photoURL: string;
  votes?: Votes;
}

interface VotesData {
  userId: string;
  votes: Record<string, string>;
  timestamp: Date;
}

let globalUser: UserData | null = null;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!
}

function initFirebase(){
  const config = firebaseConfig;

  const app = initializeApp(config);
  const authFirestore = getAuth(app);
  const dbFirestore = getFirestore(app);

  return { authFirestore, dbFirestore };
}

const {dbFirestore, authFirestore} = initFirebase();
async function initUserFirebase(authFirestore: Auth, dbFirestore: Firestore) {

    await setPersistence(authFirestore, browserLocalPersistence);

    await setPersistence(authFirestore, browserLocalPersistence);

    onAuthStateChanged(authFirestore, async (user) => {
      if (user) {
        globalUser = await fetchUserData(dbFirestore, user.email!);
        if (globalUser) {
          localStorage.setItem("user", JSON.stringify(globalUser));
          displayUserInfo(globalUser);
        } else {
          console.error("User not found in 'users' collection.");
        }
      }
    });

    return { authFirestore, dbFirestore };
}

async function fetchUserData(db: Firestore, email: string): Promise<UserData | null> {
  try {
    const userRef = doc(db, process.env.NEXT_PUBLIC_USERS_COLLECTION!, email);
    const docSnap: DocumentSnapshot<DocumentData> = await getDoc(userRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

async function updateUserBestScore(email: string, newBestScore: number, db: Firestore): Promise<void> {
  const userRef = doc(db, process.env.NEXT_PUBLIC_USERS_COLLECTION!, email);

  try {
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();

      const currentBestScore = userData.best_score?.value || 0;
      if (newBestScore > currentBestScore) {
        await setDoc(
          userRef,
          {
            best_score: {
              value: newBestScore,
              updatedAt: new Date().toISOString(),
            },
          },
          { merge: true }
        );
        console.log("User best score updated successfully.");
      } else {
        console.log("New score is not higher. No update performed.");
      }
    } else {
      await setDoc(userRef, {
        best_score: { value: newBestScore, updatedAt: new Date() },
      });
      console.log("User document created with best score.");
    }
  } catch (error) {
    console.error("Error updating user best score:", error);
  }
}


async function updateUserCredits(
  email: string,
  value: number,
  db: Firestore
): Promise<void> {
  const userRef = doc(db, process.env.NEXT_PUBLIC_USERS_COLLECTION!, email);

  try {
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();

      let currentCredits = userData.credits?.value || 0;
      
      if (currentCredits < 0 ) {
        currentCredits = 0
      }
      console.log("currentCredits", currentCredits)
      if (currentCredits >= 0) {

        await setDoc(
          userRef,
          {
            credits: {
              value: currentCredits + value,
              updatedAt: new Date().toISOString(),
            },
          },
          { merge: true },
        );
        console.log("User credits updated successfully.");
      } else {
        console.log("New credit is not done. No update performed.");
      }
    } else {
      await setDoc(userRef, {
        credits: { value: value, updatedAt: new Date() },
      });
      console.log("User document created with credits.");
    }
  } catch (error) {
    console.error("Error updating user credits:", error);
  }
}
async function updateUserCurrency(
  email: string,
  value: number,
  db: Firestore
): Promise<void> {
  const userRef = doc(db, process.env.NEXT_PUBLIC_USERS_COLLECTION!, email);

  try {
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();

      const currentCurrency = userData.currency?.value || 0;
      if (value > 0) {
        await setDoc(
          userRef,
          {
            currency: {
              value: currentCurrency + value,
              updatedAt: new Date().toISOString(),
            },
          },
          { merge: true },
        );
        console.log("User best score updated successfully.");
      } else {
        console.log("New score is not higher. No update performed.");
      }
    } else {
      await setDoc(userRef, {
        currency: { value: value, updatedAt: new Date() },
      });
      console.log("User document created with best score.");
    }
  } catch (error) {
    console.error("Error updating user best score:", error);
  }
}

async function updateUserTotalGames(
  email: string,
  value: number,
  db: Firestore
): Promise<void> {
  const userRef = doc(db, process.env.NEXT_PUBLIC_USERS_COLLECTION!, email);

  try {
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();

      const currentTotalGames = userData.total_games?.value || 0;
      if (value > 0) {
        await setDoc(
          userRef,
          {
            total_games: {
              value: currentTotalGames + value,
              updatedAt: new Date().toISOString(),
            },
          },
          { merge: true },
        );
        console.log("User number of games updated successfully.");
      } else {
        console.log("New score is not higher. No update performed.");
      }
    } else {
      await setDoc(userRef, {
        total_games: { value: value, updatedAt: new Date() },
      });
      console.log("User document created with number of games.");
    }
  } catch (error) {
    console.error("Error updating user number of games:", error);
  }
}

async function updateMatchHistory(
  email: string,
  matchData: Omit<MatchHistoryEntry, "id">,
  db: Firestore
): Promise<void> {

  const userRef = doc(db, process.env.NEXT_PUBLIC_USERS_COLLECTION!, email);

  try {
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const currentHistory = userData.match_history || [];

      const maxId = currentHistory.reduce(
        (max: number, match: MatchHistoryEntry) => Math.max(max, match.id),
        0,
      );

      const newMatch = {
        ...matchData,
        id: maxId + 1,
        date: new Date(matchData.date).toISOString(),
      };

      const updatedHistory = [newMatch, ...currentHistory];

      const limitedHistory = updatedHistory.slice(0, 10);

      await setDoc(
        userRef,
        {
          match_history: limitedHistory,
        },
        { merge: true },
      );
      console.log("Match history updated successfully.");
    } else {
      await setDoc(userRef, {
        match_history: [
          {
            ...matchData,
            id: 1,
            date: new Date(matchData.date).toISOString(),
          },
        ],
      });
      console.log("User document created with first match history entry.");
    }
  } catch (error) {
    console.error("Error updating match history:", error);
    throw error;
  }
}

async function updateStory(
  email: string,
  storyData: Omit<StoryEntry, "id">,
  db: Firestore
): Promise<void> {

  const userRef = doc(db, process.env.NEXT_PUBLIC_USERS_COLLECTION!, email);

  try {
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const currentStory = userData.story || [];

      const maxId = currentStory.reduce(
        (max: number, story: StoryEntry) => Math.max(max, story.id),
        0,
      );

      const newStory = {
        ...storyData,
        id: maxId + 1,
        date: new Date(storyData.date).toISOString(),
      };

      const updatedStory = [newStory, ...currentStory];

      const limitedStory = updatedStory.slice(0, 10);

      await setDoc(
        userRef,
        {
          story: limitedStory,
        },
        { merge: true },
      );
      console.log("Match history updated successfully.");
    } else {
      await setDoc(userRef, {
        story: [
          {
            ...storyData,
            id: 1,
            date: new Date(storyData.date).toISOString(),
          },
        ],
      });
      console.log("User document created with first match story entry.");
    }
  } catch (error) {
    console.error("Error updating match story:", error);
    throw error;
  }
}
function displayUserInfo(user: UserData): void {
  console.log(
    `User: ${user.displayName}, Best Score: ${user.best_score.value}, Currency: ${user.currency.value}, Total Games: ${user.total_games.value}, Photo URL: ${user.photoURL}`
  );
}

async function updateUserVotes(
  email: string, 
  votes: Record<string, string>, 
  db: Firestore
): Promise<void> {
  const userRef = doc(db, process.env.NEXT_PUBLIC_USERS_COLLECTION!, email);

  try {
    const userSnap = await getDoc(userRef);
    const votesData: VotesData = {
      userId: email,
      votes: votes,
      timestamp: new Date()
    };

    await setDoc(
      userRef,
      votesData,
      { merge: true }
    );

    console.log("User votes updated successfully.");
  } catch (error) {
    console.error("Error updating user votes:", error);
    throw error;
  }
}

export {
  authFirestore,
  dbFirestore,
  displayUserInfo,
  fetchUserData,
  initFirebase,
  initUserFirebase,
  updateStory,
  updateUserBestScore,
  updateUserCredits,
  updateUserCurrency,
  updateMatchHistory,
  updateUserTotalGames,
  updateUserVotes,
};

export type { UserData, MatchHistoryEntry };
