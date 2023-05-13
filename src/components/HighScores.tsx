import React, { FC, useEffect, useState } from "react";
import { handleSubmitName, isHighScore } from "../Firebase/FirebaseHelpers";
import "material-icons/iconfont/material-icons.css";
import { PlayerScore } from "../Game/models";
import "./HighScores.css";
import { H2, StackHor, StackVert } from "./MHComponents.tsx/Components";
import { MHButton } from "./MHComponents.tsx/MHButton";
import { NewHighScore } from "./NewHighScore";
import { ScoreListItem } from "./ScoreListItem";

interface HighScoresProps {
  score: number;
  scores: PlayerScore[] | undefined;
  playerPrevScore: PlayerScore | undefined;
  mainMenu: () => void;
}

export const HighScores: FC<HighScoresProps> = (props) => {
  const { score, mainMenu, scores, playerPrevScore } = props;
  const [gotHighScore, setGotHighScore] = useState<boolean>(false);

  const [savedScore, setSavedScore] = useState<boolean>(false);

  const handleSubmit = (name: string) => {
    localStorage.setItem("mate-champ-name", name);
    return handleSubmitName(name, score).then(() => {
      setGotHighScore(false);
      setSavedScore(true);
    });
  };

  useEffect(() => {
    if (!scores) return;
    const isHigh = isHighScore(score, scores, playerPrevScore);

    setGotHighScore(isHigh);
    if (isHigh) {
      setSavedScore(false);
    }
  }, [score]);

  if (savedScore || gotHighScore === false) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <StackHor style={{ justifyContent: "space-between" }}>
          <span className="material-icons back-button" onClick={mainMenu}>
            {"arrow_back"}
          </span>
          <H2 style={{ alignSelf: "center" }}>Score Board:</H2>
          <div style={{ width: "2rem" }}></div>
        </StackHor>
        <hr
          style={{
            width: "100%",
            borderColor: "green",
            marginBottom: "1rem",
          }}
        />
        {(scores ?? new Array(15).fill(null)).map((score, i) => (
          <ScoreListItem num={i + 1} score={score} key={i} />
        ))}
      </div>
    );
  }

  if (!playerPrevScore) {
    return (
      <NewHighScore
        score={score}
        onSubmit={handleSubmit}
      />
    );
  }

  return (
    <StackVert>
      <H2>New High Score of {score}!</H2>
      <MHButton
        style={{ padding: "1rem" }}
        onClick={() => handleSubmit(playerPrevScore.name)}
      >
        View Scores
      </MHButton>
    </StackVert>
  );
};

export default HighScores;
