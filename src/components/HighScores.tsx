import { FC, useEffect, useState } from "react";
import { handleSubmitName, isHighScore } from "../Firebase/FirebaseHelpers";
import { PlayerScore } from "../Game/models";
import { NewHighScore } from "./NewHighScore";
import { ScoreListItem } from "./ScoreListItem";
import { Button, Divider, IconButton, Stack, Typography } from "@mui/joy";
import { ArrowBack } from "@mui/icons-material";

const emptyScoreList: PlayerScore[] = Array.from({ length: 15 }).map(
  (_, i) => ({ name: "...", score: 0 })
);

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
      <Stack width="100%" gap="1rem">
        <Stack direction="row" justifyContent="space-between">
          <IconButton onClick={mainMenu}>
            <ArrowBack />
          </IconButton>
          <Typography level="h2">High Scores</Typography>
          <div style={{ width: "2rem" }}></div>
        </Stack>
        <Divider />
        <Stack>
          {(scores ?? emptyScoreList).map((info, i) => (
            <ScoreListItem num={i + 1} score={info} key={i} />
          ))}
        </Stack>
      </Stack>
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
