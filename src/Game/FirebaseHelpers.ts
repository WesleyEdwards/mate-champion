import { addDoc, collection, getDocs } from "firebase/firestore";
import { firebaseDb } from "./Firebase";
import { PlayerScore } from "./models";

export const handleSubmitName = async (name: string, score: number) => {
  const scoresRef = collection(firebaseDb, "scores");
  addDoc(scoresRef, { name, score })
};

export const fetchPlayerScores = async (): Promise<PlayerScore[]> => {
  const scoresRef = collection(firebaseDb, "scores");
  const scoresSnapshot = await getDocs(scoresRef);
  const scoresList = scoresSnapshot.docs.map((doc) =>
    doc.data()
  ) as PlayerScore[];

  const sorted = scoresList.sort((a, b) => b.score - a.score).splice(0, 5);
  return sorted;
};

export const isHighScore = async (score: number): Promise<boolean> => {
  const scores = await fetchPlayerScores();
  return scores.some((playerScore) => playerScore.score < score);
};
