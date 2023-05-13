import React, { FC, useEffect, useState } from "react";
import {
  fetchPlayerScores,
  handleSubmitName,
  isHighScore,
} from "../Firebase/FirebaseHelpers";
import "material-icons/iconfont/material-icons.css";
import { PlayerScore } from "../Game/models";
import "./HighScores.css";
import { H2, StackHor, StackVert } from "./MHComponents.tsx/Components";
import { MHButton } from "./MHComponents.tsx/MHButton";
import { NewHighScore } from "./NewHighScore";
import { ScoreListItem } from "./ScoreListItem";

interface HighScoresProps {
  score: number;
  play: () => void;
  mainMenu: () => void;
}

export const HighScores: FC<HighScoresProps> = (props) => {
  const { score, play, mainMenu } = props;
  const [scores, setScores] = useState<PlayerScore[]>();
  const [gotHighScore, setGotHighScore] = useState<boolean>(false);

  const [savedScore, setSavedScore] = useState<boolean>(false);

  const originalName = localStorage.getItem("name");

  const fetchScores = () => {
    setScores(undefined);
    fetchPlayerScores().then(setScores);
  };

  const handleSubmit = (name: string) => {
    localStorage.setItem("name", name);
    return handleSubmitName(name, score).then(() => {
      fetchScores();
      setGotHighScore(false);
      setSavedScore(true);
    });
  };

  useEffect(() => {
    isHighScore(score).then((isHigh) => {
      setGotHighScore(isHigh);
      if (isHigh) {
        setSavedScore(false);
      }
      fetchScores();
    });
  }, [score]);

  return (
    <>
      {(() => {
        if (savedScore || gotHighScore === false) {
          if (scores === undefined) {
            return (
              <div>
                {new Array(15).fill(null).map((_, i) => (
                  <ScoreListItem
                    num={i + 1}
                    score={{ name: "...", score: 0 }}
                    key={i}
                  />
                ))}
              </div>
            );
          }

          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <StackHor
                style={{
                  justifyContent: "space-between",
                }}
              >
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
              {scores.map((score, i) => (
                <ScoreListItem num={i + 1} score={score} key={i} />
              ))}
            </div>
          );
        }

        if (gotHighScore && originalName === null) {
          return (
            <NewHighScore
              score={score}
              scoreSubmitted={() => setGotHighScore(false)}
              onSubmit={handleSubmit}
            />
          );
        }

        return (
          <StackVert>
            <H2>New High Score! {score}</H2>
            <MHButton
              style={{ padding: "1rem" }}
              onClick={() => handleSubmit(originalName ?? "")}
            >
              View Scores
            </MHButton>
          </StackVert>
        );
      })()}
    </>
  );
};

export default HighScores;
