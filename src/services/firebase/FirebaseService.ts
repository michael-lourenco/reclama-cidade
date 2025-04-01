import {
  addDoc,
  arrayUnion,
  collection,
  getFirestore,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  orderBy,
  updateDoc,
  type Firestore,
  type DocumentSnapshot,
  type DocumentData,
  serverTimestamp,
} from "firebase/firestore"
import { initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence, type Auth } from "firebase/auth"
import type { UserData } from "@/types/user"
import type { Marker } from "@/types/marker"
import type { StatusChange } from "@/types/marker"


export enum ProblemStatus {
  REPORTED = "Reportado",
  UNDER_ANALYSIS = "Em Análise",
  VERIFIED = "Verificado",
  IN_PROGRESS = "Em Andamento",
  RESOLVED = "Resolvido",
  CLOSED = "Fechado",
  REOPENED = "Reaberto",
  // Adicione outros conforme necessário
}

export interface FirestoreTimestamp {
  toDate: () => Date
  seconds: number
  nanoseconds: number
}

export interface UserMarker {
  id: string
  lat: number
  lng: number
  type: string
  createdAt: Date
}

let globalUser: UserData | null = null

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
}

function initFirebase() {
  const config = firebaseConfig

  const app = initializeApp(config)
  const authFirestore = getAuth(app)
  const dbFirestore = getFirestore(app)

  return { authFirestore, dbFirestore }
}

const { dbFirestore, authFirestore } = initFirebase()
async function initUserFirebase(authFirestore: Auth, dbFirestore: Firestore) {
  await setPersistence(authFirestore, browserLocalPersistence)

  await setPersistence(authFirestore, browserLocalPersistence)

  onAuthStateChanged(authFirestore, async (user) => {
    if (user) {
      globalUser = await fetchUserData(dbFirestore, user.email!)
      if (globalUser) {
        localStorage.setItem("user", JSON.stringify(globalUser))
        displayUserInfo(globalUser)
      } else {
        console.error("User not found in 'users' collection.")
      }
    }
  })

  return { authFirestore, dbFirestore }
}

async function fetchUserData(db: Firestore, email: string): Promise<UserData | null> {
  try {
    const userRef = doc(db, process.env.NEXT_PUBLIC_USERS_COLLECTION!, email)
    const docSnap: DocumentSnapshot<DocumentData> = await getDoc(userRef)

    if (docSnap.exists()) {
      return docSnap.data() as UserData
    }
    return null
  } catch (error) {
    console.error("Error fetching user data:", error)
    return null
  }
}

async function updateMarkers(db: Firestore, markerId: string, updatedData: Partial<Marker>): Promise<void> {
  const markerRef = doc(db, "markers", markerId)
  await updateDoc(markerRef, updatedData)
}

async function updateUserMarker(
  db: Firestore,
  email: string,
  markerId: string,
  updatedData: Partial<UserMarker>,
): Promise<void> {
  const markerRef = doc(db, `users/${email}/markers`, markerId)
  await updateDoc(markerRef, updatedData)
}

async function addMarker(db: Firestore, marker: Marker): Promise<void> {
  const markerRef = doc(db, "markers", marker.id)
  await setDoc(markerRef, marker)
  
  // Criar o status inicial como "Reportado" ao adicionar um marcador
  await addStatusChange(marker.id, ProblemStatus.REPORTED, "Problema reportado inicialmente", marker.userEmail)
}

async function addUserMarker(db: Firestore, email: string, marker: UserMarker): Promise<void> {
  const markerRef = doc(db, `users/${email}/markers`, marker.id)
  await setDoc(markerRef, marker)
}

async function removeMarker(db: Firestore, markerId: string): Promise<void> {
  const markerRef = doc(db, "markers", markerId)
  await deleteDoc(markerRef)
}

async function removeUserMarker(db: Firestore, email: string, markerId: string): Promise<void> {
  const markerRef = doc(db, `users/${email}/markers`, markerId)
  await deleteDoc(markerRef)
}

async function getMarkers(db: Firestore) {
  const markersRef = collection(db, "markers")
  const querySnapshot = await getDocs(markersRef)

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

async function getUserMarkers(db: Firestore, email: string) {
  const userMarkersRef = collection(db, `users/${email}/markers`)
  const querySnapshot = await getDocs(userMarkersRef)

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

async function updateUserCredits(email: string, value: number, db: Firestore): Promise<void> {
  const userRef = doc(db, process.env.NEXT_PUBLIC_USERS_COLLECTION!, email)

  try {
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const userData = userSnap.data()

      let currentCredits = userData.credits?.value || 0

      if (currentCredits < 0) {
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
        )
        console.log("User credits updated successfully.")
      } else {
        console.log("New credit is not done. No update performed.")
      }
    } else {
      await setDoc(userRef, {
        credits: { value: value, updatedAt: new Date() },
      })
      console.log("User document created with credits.")
    }
  } catch (error) {
    console.error("Error updating user credits:", error)
  }
}
async function updateUserCurrency(email: string, value: number, db: Firestore): Promise<void> {
  const userRef = doc(db, process.env.NEXT_PUBLIC_USERS_COLLECTION!, email)

  try {
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const userData = userSnap.data()

      const currentCurrency = userData.currency?.value || 0
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
        )
        console.log("User best score updated successfully.")
      } else {
        console.log("New score is not higher. No update performed.")
      }
    } else {
      await setDoc(userRef, {
        currency: { value: value, updatedAt: new Date() },
      })
      console.log("User document created with best score.")
    }
  } catch (error) {
    console.error("Error updating user best score:", error)
  }
}

function displayUserInfo(user: UserData): void {
  console.log(`User: ${user.displayName}, Currency: ${user.currency.value}, Photo URL: ${user.photoURL}`)
}

const updateMarkerLikes = async (dbFirestore: Firestore, markerId: string, userEmail: string) => {
  try {
    const markerRef = doc(dbFirestore, "markers", markerId)

    await updateDoc(markerRef, {
      likedBy: arrayUnion(userEmail),
    })
  } catch (error) {
    console.error("Erro ao atualizar likes do marcador:", error)
    throw error
  }
}

// Função separada para adicionar entrada ao histórico de status
async function addStatusChange(
  markerId: string,
  status: ProblemStatus,
  comment: string | undefined,
  updatedBy: string
): Promise<string> {
  const db = getFirestore();
  
  const statusChangeData = {
    status,
    timestamp: serverTimestamp(),
    comment,
    updatedBy
  };
  
  const docRef = await addDoc(
    collection(db, 'markers', markerId, 'statusHistory'),
    statusChangeData
  );
  
  return docRef.id;
}

// Atualizar status e registrar no histórico
async function updateMarkerStatus(
  markerId: string, 
  newStatus: ProblemStatus, 
  comment: string | undefined, 
  updatedBy: string
): Promise<void> {
  const db = getFirestore();
  
  // Atualizar status atual no marcador
  await updateDoc(doc(db, 'markers', markerId), {
    currentStatus: newStatus
  });
  
  // Chamar a função separada para adicionar ao histórico
  await addStatusChange(markerId, newStatus, comment, updatedBy);
}

// Obter histórico de um marcador
async function getMarkerStatusHistory(markerId: string) {
  const db = getFirestore();
  const historyRef = collection(db, 'markers', markerId, 'statusHistory');
  
  // Ordenar por timestamp decrescente (mais recente primeiro)
  const q = query(historyRef, orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as StatusChange[];
}

export {
  authFirestore,
  dbFirestore,
  displayUserInfo,
  fetchUserData,
  getMarkers,
  getMarkerStatusHistory,
  getUserMarkers,
  initFirebase,
  initUserFirebase,
  updateUserCredits,
  updateUserCurrency,
  updateMarkers,
  updateMarkerLikes,
  updateMarkerStatus,
  addStatusChange,
  updateUserMarker,
  addMarker,
  addUserMarker,
  removeMarker,
  removeUserMarker,
}

export type { UserData }