import React, { FC, useEffect, useState } from "react";
import {
  fetchPlayerScores,
  handleSubmitName,
  isHighScore,
} from "../Firebase/FirebaseHelpers";
import { PlayerScore } from "../Game/models";
import { NewHighScore } from "./NewHighScore";

interface ScoreListItemProps {
  score: PlayerScore;
  num: number;
}

const ScoreListItem: FC<ScoreListItemProps> = (props) => {
  const { score, num } = props;
  return (
    <p className="green-text">{`${num} - ${score.name} (${score.score})`}</p>
  );
};

interface HighScoresProps {
  score: number;
  enablePlay: () => void;
}

export const HighScores: FC<HighScoresProps> = (props) => {
  const { score, enablePlay } = props;
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
      enablePlay();
      setSavedScore(true);
    });
  };

  useEffect(() => {
    isHighScore(score).then((isHigh) => {
      setGotHighScore(isHigh);
      if (isHigh) {
        setSavedScore(false);
      } else {
        enablePlay();
      }
      fetchScores();
    });
  }, []);

  return (
    <>
      {(() => {
        if (savedScore || gotHighScore === false) {
          if (scores === undefined) {
            return (
              <p className="green-text">
                {new Array(10).fill(null).map((_, i) => (
                  <ScoreListItem
                    num={i + 1}
                    score={{ name: "...", score: 0 }}
                    key={i}
                  />
                ))}
              </p>
            );
          }

          return (
            <div>
              <h2 className="green-text">Score Board:</h2>
              {scores.map((score, i) => (
                <ScoreListItem num={i + 1} score={score} key={i} />
              ))}
            </div>
          );
        }

        if (gotHighScore && originalName === null) {
          <NewHighScore
            score={score}
            enablePlay={enablePlay}
            onSubmit={handleSubmit}
          />;
        }

        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h2 className="green-text">New High Score! {score}</h2>
            <button
              id="view-scores"
              className="btn"
              style={{ padding: "1rem" }}
              onClick={() => handleSubmit(originalName ?? "")}
            >
              View Scores
            </button>
          </div>
        );
      })()}
    </>
  );
};

export default HighScores;
