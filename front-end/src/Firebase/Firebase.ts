import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAdl_7oyt_3RA0edolD2bZKJco3EcAUpTc",
  authDomain: "mate-champion.firebaseapp.com",
  databaseURL: "https://mate-champion-default-rtdb.firebaseio.com",
  projectId: "mate-champion",
  storageBucket: "mate-champion.appspot.com",
  messagingSenderId: "330192634440",
  appId: "1:330192634440:web:38f01f89e51224ffa5ce7d"
};

const app = initializeApp(firebaseConfig);


export const firebaseDb = getFirestore(app);
