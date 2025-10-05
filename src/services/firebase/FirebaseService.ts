// FirebaseService desativado: utilize MarkerService (Prisma) para dados.
throw new Error("FirebaseService.ts está desativado. Use os serviços Prisma em src/services/prisma/MarkerService.ts")
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


// FirebaseService desativado: utilize MarkerService (Prisma) para dados.
throw new Error("FirebaseService.ts está desativado. Use os serviços Prisma em src/services/prisma/MarkerService.ts")
    const markerRef = doc(dbFirestore, "markers", markerId)
