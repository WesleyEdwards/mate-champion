import {
  addDoc,
  collection,
  deleteDoc,
  DocumentData,
  getDocs,
  query,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import { firebaseCollection } from "../Game/constants";
import { PlayerScore } from "../Game/models";
import { firebaseDb } from "./Firebase";

const scoresRef = collection(firebaseDb, firebaseCollection);
const numberDisplayed = 15;

async function getUsers(name: string): Promise<QuerySnapshot<DocumentData>> {
  const q = query(scoresRef, where("name", "==", name));
  const querySnapshot = await getDocs(q);
  return querySnapshot;
}

export const userExists = async (name: string): Promise<DocumentData[]> => {
  const querySnapshot = await getUsers(name);
  const docs = querySnapshot.docs.map((doc) => doc.data());
  return docs;
};

export const handleSubmitName = async (
  newName: string,
  score: number
): Promise<unknown> => {
  const querySnapshot = await getUsers(newName);

  querySnapshot.forEach((doc) => {
    if (doc.data().score <= score) {
      deleteDoc(doc.ref);
    }
  });

  return addDoc(scoresRef, { name: newName, score });
};

export const fetchPlayerScores = async (): Promise<PlayerScore[]> => {
  const scoresRef = collection(firebaseDb, firebaseCollection);
  const scoresSnapshot = await getDocs(scoresRef);
  const scoresList = scoresSnapshot.docs.map((doc) =>
    doc.data()
  ) as PlayerScore[];

  return scoresList
    .sort((a, b) => b.score - a.score)
    .splice(0, numberDisplayed);
};

export const isHighScore = async (score: number): Promise<boolean> => {
  const scores = await fetchPlayerScores();

  if (
    scores.every((playerScore) => playerScore.score > score) &&
    scores.length >= numberDisplayed
  ) {
    return false;
  }

  const name = localStorage.getItem("name");
  if (name) {
    const users = await userExists(name!);
    if (users) {
      return users.every((user) => user.score < score);
    }
  }

  return scores.some((playerScore) => playerScore.score < score);
};
