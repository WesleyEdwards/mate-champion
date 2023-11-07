import { useEffect, useState } from "react";
import { PlayerScore } from "../Game/models";
import {
  fetchPlayerScores,
  playerPrevScore,
} from "../Firebase/FirebaseHelpers";

export const useScoreData = () => {
  const [scores, setScores] = useState<PlayerScore[]>();
  const [playerScore, setPlayerScore] = useState<PlayerScore>();

  const userHighScore = async () => {
    const originalName = localStorage.getItem("mate-champ-name");
    if (!originalName) return undefined;

    playerPrevScore(originalName).then(setPlayerScore);
  };

  const refreshScores = () => {
    setScores(undefined);
    fetchPlayerScores().then(setScores);
  };

  useEffect(() => {
    userHighScore();
    refreshScores();
  }, []);

  return { scores, refreshScores, playerScore };
};
