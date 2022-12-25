import {
  addDoc,
  collection,
  deleteDoc,
  DocumentData,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firebaseCollection } from "./constants";
import { firebaseDb } from "./Firebase";
import { PlayerScore } from "./models";

const scoresRef = collection(firebaseDb, firebaseCollection);

const userExists = async (name: string): Promise<DocumentData[]> => {
  const q = query(scoresRef, where("name", "==", name));
  const querySnapshot = await getDocs(q);

  const docs = querySnapshot.docs.map((doc) => doc.data());
  return docs;
};

const checkDuplicates = async (
  name: string,
  score: number
): Promise<boolean> => {
  const q = query(
    scoresRef,
    where("name", "==", name),
    where("score", "==", score)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.size > 0;
};

export const handleSubmitName = async (
  newName: string,
  score: number
): Promise<unknown> => {
  const q = query(scoresRef, where("name", "==", newName));
  const querySnapshot = await getDocs(q);

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

  const sorted = scoresList
    .sort((a, b) => b.score - a.score)
    .reduce((acc, cur) => {
      if (acc.length < 10) {
        const found = acc.find(
          (a) => a.score === cur.score && a.name === cur.name
        );
        if (!found) {
          acc.push(cur);
        }
      }
      return acc;
    }, [] as PlayerScore[])
    .splice(0, 10);
  return sorted;
};

export const isHighScore = async (score: number): Promise<boolean> => {
  const scores = await fetchPlayerScores();

  if (scores.every((playerScore) => playerScore.score > score)) {
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

export const trySaveScore = async (score: number): Promise<boolean> => {
  const foundName = localStorage.getItem("name");
  if (foundName) {
    await handleSubmitName(foundName, score);
    return true;
  }
  return false;
};
