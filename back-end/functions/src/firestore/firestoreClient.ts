// import {QueryConstraint, where} from "firebase/firestore"
// import {Condition, HasId} from "../DbClient"

// export const firestoreClient = (): DbClient => {
//   return {
//     user: functionsForModel<User>(firebaseDb, "user", "test"),
//     score: functionsForModel<Score>(firebaseDb, "score", "test")
//   }
// }

// const conditionToQuery = <T extends HasId>(
//   condition: Condition<T>
// ): QueryConstraint[] => {
//   const constraints: QueryConstraint[] = []
//   for (const key in condition) {
//     const value = condition[key]
//     if (Array.isArray(value)) {
//       constraints.push(where(key, "in", value))
//     } else {
//       constraints.push(where(key, "==", value))
//     }
//   }
//   return constraints
// }

// function functionsForModel<T extends HasId>(
//   db: Firestore,
//   model: string,
//   pathPrefix?: string
// ) {
//   // getAuth()
//   //   .createCustomToken("some-uid", {
//   //     premiumAccount: true
//   //   })
//   //   .then((customToken) => {
//   //     console.log(customToken)
//   //     // Send token back to client
//   //   })
//   //   .catch((error) => {
//   //     console.log("Error creating custom token:", error)
//   //   })

//   const path = pathPrefix ? `${pathPrefix}-${model}` : model
//   const ref = collection(db, path)

//   return {
//     insertOne: async (item: T): Promise<T | undefined> => {
//       const added = await addDoc(ref, item)

//       console.log(added)

//       return item
//     },
//     findOne: async (filter: Condition<T>): Promise<T | undefined> => {
//       const q = await query(ref, conditionToQuery(filter)[0])
//       const querySnapshot = await getDocs(q)
//       const docs = querySnapshot.docs.map((doc) => doc.data())?.[0] as T

//       return docs
//     },
//     findMany: async (filter?: Condition<T>): Promise<T[]> => {
//       const q = filter ? query(ref, conditionToQuery(filter)[0]) : query(ref)
//       const querySnapshot = await getDocs(q)
//       const docs = querySnapshot.docs.map((doc) => doc.data())
//       return docs as T[]
//     },
//     updateOne: async (
//       id: string,
//       update: Partial<T>
//     ): Promise<T | undefined> => {
//       const q = await query(ref, where("_id", "==", id))
//       const querySnapshot = await getDocs(q)
//       const doc = querySnapshot.docs.map((doc) => doc.data())?.[0] as T

//       Object.entries(update).forEach(async ([key, value]) => {
//         await updateDoc(querySnapshot.docs[0].ref, key, value)
//       })

//       return doc as T
//     }
//   }
// }

export const asdf = 1
