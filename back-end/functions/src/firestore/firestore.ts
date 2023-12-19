import {FirebaseOptions, initializeApp} from "firebase/app"
import {getFirestore} from "firebase/firestore"

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyAdl_7oyt_3RA0edolD2bZKJco3EcAUpTc",
  authDomain: "mate-champion.firebaseapp.com",
  projectId: "mate-champion",
  storageBucket: "mate-champion.appspot.com",
  messagingSenderId: "330192634440",
  appId: "1:330192634440:web:0e60f1ab6e0bd2a8a5ce7d"
}

const app = initializeApp(firebaseConfig)


export const firebaseDb = getFirestore(app)
