import { FC, useEffect, useState } from "react";
import { handleSubmitName, isHighScore } from "../Firebase/FirebaseHelpers";
import { PlayerScore } from "../Game/models";
import { NewHighScore } from "./NewHighScore";
import { ScoreListItem } from "./ScoreListItem";
import { Button, Stack, Typography } from "@mui/joy";

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
        <Stack direction="row" style={{ justifyContent: "space-between" }}>
          <span className="material-icons back-button" onClick={mainMenu}>
            {"arrow_back"}
          </span>
          <Typography style={{ alignSelf: "center" }}>Score Board:</Typography>
          <div style={{ width: "2rem" }}></div>
        </Stack>
        <hr
          style={{
            width: "100%",
            borderColor: "green",
            marginBottom: "1rem",
          }}
        />
        {(scores ?? Array.from({ length: 15 })).map((score, i) => (
          <ScoreListItem num={i + 1} score={score} key={i} />
        ))}
      </div>
    );
  }

  if (!playerPrevScore) {
    return <NewHighScore score={score} onSubmit={handleSubmit} />;
  }

  return (
    <Stack>
      <Typography>New High Score of {score}!</Typography>
      <Button
        style={{ padding: "1rem" }}
        onClick={() => handleSubmit(playerPrevScore.name)}
      >
        View Scores
      </Button>
    </Stack>
  );
};

export default HighScores;
