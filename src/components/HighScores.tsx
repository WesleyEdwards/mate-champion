import React, { FC, useEffect, useState } from "react";
import {
  fetchPlayerScores,
  handleSubmitName,
  isHighScore,
} from "../Firebase/FirebaseHelpers";
import { PlayerScore } from "../Game/models";
import { H2, StackVert } from "./MHComponents.tsx/Components";
import { MHButton } from "./MHComponents.tsx/MHButton";
import { MHTypography } from "./MHComponents.tsx/MHTypography";
import { NewHighScore } from "./NewHighScore";

interface ScoreListItemProps {
  score: PlayerScore;
  num: number;
}

const ScoreListItem: FC<ScoreListItemProps> = (props) => {
  const { score, num } = props;
  return (
    <>
      <MHTypography
        style={{
          maxWidth: "24rem",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          flexDirection: "row",
          overflow: "hidden",
          minWidth: "3rem",
          flex: "1",
        }}
      >{`${num} - ${score.name} (${score.score})`}</MHTypography>
    </>
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
  }, [enablePlay, score]);

  return (
    <>
      {(() => {
        if (savedScore || gotHighScore === false) {
          if (scores === undefined) {
            return (
              <div>
                {new Array(10).fill(null).map((_, i) => (
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
                maxWidth: "12rem",
              }}
            >
              <H2>Score Board:</H2>
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
              enablePlay={enablePlay}
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
