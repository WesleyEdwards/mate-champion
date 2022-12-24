import React, { FC, useEffect, useState } from "react";
import {
  fetchPlayerScores,
  handleSubmitName,
  isHighScore,
} from "../FirebaseHelpers";
import { PlayerScore } from "../models";

interface ScoreListItemProps {
  score: PlayerScore;
  num: number;
}

const ScoreListItem: FC<ScoreListItemProps> = (props) => {
  const { score } = props;
  return (
    <p className="green-text">
      {score.name} - {score.score}
    </p>
  );
};

export const HighScores: FC<{ score: number }> = (props) => {
  const { score } = props;
  const [scores, setScores] = useState<PlayerScore[]>();
  const [gotHighScore, setGotHighScore] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);

  const [name, setName] = useState<string>("");

  const handleSubmit = () => {
    setDisableSubmit(true);
    if (!name) return;
    handleSubmitName(name, score).then(() => {
      setGotHighScore(false);
    });
  };

  useEffect(() => {
    fetchPlayerScores().then(setScores);
    isHighScore(score).then(setGotHighScore);
  }, [score]);

  if (!scores) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {gotHighScore ? (
        <div>
          <h2>Game Over!</h2>
          <p>
            You got a high score!
            <br />
            To receive credit, Enter your name:
          </p>
          <div id="submit-box">
            <input
              id="submit-score"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              type="submit"
              id="submit-score"
              className="btn"
              disabled={disableSubmit}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      ) : (
        <>
          <h2 className="green-text">High Scores:</h2>
          {scores.map((score, i) => (
            <ScoreListItem num={i} score={score} key={i} />
          ))}
        </>
      )}
    </>
  );
};
