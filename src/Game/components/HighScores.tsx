import React, { FC, useEffect, useState } from "react";
import {
  fetchPlayerScores,
  handleSubmitName,
  isHighScore,
  trySaveScore,
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
  const [gotHighScore, setGotHighScore] = useState<boolean>();
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [congratulations, setCongratulations] = useState<boolean>();

  const [name, setName] = useState<string>("");

  const fetchScores = () => {
    setScores(undefined);
    fetchPlayerScores().then(setScores);
  };

  const handleSubmit = () => {
    setDisableSubmit(true);
    localStorage.setItem("name", name);

    if (!name) return;
    handleSubmitName(name, score).then(() => {
      fetchScores();
      setGotHighScore(false);
      enablePlay();
    });
  };

  // const useMountEffect = (initiate: () => void) => useEffect(initiate, []);

  // useMountEffect(initiate);

  useEffect(() => {
    fetchScores();
    isHighScore(score).then((isHigh) => {
      if (isHigh) {
        trySaveScore(score).then((saved) => {
          if (saved) {
            setGotHighScore(false);
            setCongratulations(true);
            enablePlay();
            fetchScores();
          }
        });
      } else {
        enablePlay();
      }
      setGotHighScore(isHigh);
    });
  }, []);

  if (!scores || gotHighScore === undefined) {
    return <p className="green-text">Loading...</p>;
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
          {congratulations && (
            <h3 className="green-text">
              Congratulations! You got a new high score!
            </h3>
          )}
          {scores.map((score, i) => (
            <ScoreListItem num={i + 1} score={score} key={i} />
          ))}
        </div>
      )}
    </>
  );
};
