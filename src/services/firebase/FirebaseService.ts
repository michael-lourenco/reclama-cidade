import { collection, getFirestore, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc, Firestore, DocumentSnapshot, DocumentData } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence, Auth } from "firebase/auth";
import { UserData } from "@/application/entities/User";

export interface UserMarker {
  id: string;
  lat: number;
  lng: number;
  type: string;
  createdAt: Date;
}
export interface Marker {
  id: string;
  lat: number;
  lng: number;
  type: string;
  userEmail: string;
  createdAt: Date;
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

async function updateMarkers(db: Firestore, markerId: string, updatedData: Partial<Marker>): Promise<void> {
  const markerRef = doc(db, "markers", markerId);
  await updateDoc(markerRef, updatedData);
}

async function updateUserMarker(db: Firestore, email: string, markerId: string, updatedData: Partial<UserMarker>): Promise<void> {
  const markerRef = doc(db, `users/${email}/markers`, markerId);
  await updateDoc(markerRef, updatedData);
}

async function addMarker(db: Firestore, marker: Marker): Promise<void> {
  const markerRef = doc(db, "markers", marker.id);
  await setDoc(markerRef, marker);
}

async function addUserMarker(db: Firestore, email: string, marker: UserMarker): Promise<void> {
  const markerRef = doc(db, `users/${email}/markers`, marker.id);
  await setDoc(markerRef, marker);
}

async function removeMarker(db: Firestore, markerId: string): Promise<void> {
  const markerRef = doc(db, "markers", markerId);
  await deleteDoc(markerRef);
}

async function removeUserMarker(db: Firestore, email: string, markerId: string): Promise<void> {
  const markerRef = doc(db, `users/${email}/markers`, markerId);
  await deleteDoc(markerRef);
}

async function getMarkers(db: Firestore) {
  const markersRef = collection(db, "markers");
  const querySnapshot = await getDocs(markersRef);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data()),
  }));
}

async function getUserMarkers(db: Firestore, email: string) {
  const userMarkersRef = collection(db, `users/${email}/markers`);
  const querySnapshot = await getDocs(userMarkersRef);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data()),
  }));
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

function displayUserInfo(user: UserData): void {
  console.log(
    `User: ${user.displayName}, Currency: ${user.currency.value}, Photo URL: ${user.photoURL}`
  );
}

export {
  authFirestore,
  dbFirestore,
  displayUserInfo,
  fetchUserData,
  getMarkers,
  getUserMarkers,
  initFirebase,
  initUserFirebase,
  updateUserCredits,
  updateUserCurrency,
  updateMarkers,
  updateUserMarker,
  addMarker,
  addUserMarker,
  removeMarker,
  removeUserMarker,
};

export type { UserData };
