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

export async function userAlreadyExists(name: string): Promise<boolean> {
  const querySnapshot = await getUsers(name);
  return !querySnapshot.empty;
}

export const playerPrevScore = async (name: string): Promise<PlayerScore> => {
  const querySnapshot = await getUsers(name);
  const docs = querySnapshot.docs.map((doc) => doc.data())?.[0] as PlayerScore;
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

export const isHighScore = (
  score: number,
  scores: PlayerScore[],
  prevScore?: PlayerScore
): boolean => {
  if (
    scores.every((s) => s.score > score) &&
    scores.length >= numberDisplayed
  ) {
    return false;
  }

  if (prevScore) {
    return prevScore.score < score;
  }

  return scores.some((playerScore) => playerScore.score < score);
};
