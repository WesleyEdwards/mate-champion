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
  const [gotHighScore, setGotHighScore] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);

  const [name, setName] = useState<string>("");

  const handleSubmit = () => {
    setDisableSubmit(true);

    if (!name) return;
    handleSubmitName(name, score).then(() => {
      fetchPlayerScores().then(setScores);
      setGotHighScore(false);
      enablePlay();
    });
  };

  useEffect(() => {
    if (!gotHighScore) {
      enablePlay();
    }
    fetchPlayerScores().then(setScores);
    isHighScore(score).then(setGotHighScore);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  if (!scores) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {gotHighScore ? (
        <div>
          <h2>Game Over!</h2>
          <p className="green-text">
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
        <div>
          <h2 className="green-text">Score Board:</h2>
          {scores.map((score, i) => (
            <ScoreListItem num={i + 1} score={score} key={i} />
          ))}
        </div>
      )}
    </>
  );
};
