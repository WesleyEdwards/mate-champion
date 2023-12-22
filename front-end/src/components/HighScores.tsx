import { FC, useEffect, useState } from "react";
import { isHighScore } from "../Firebase/FirebaseHelpers";
import { CreateAccount } from "./NewHighScore";
import { ScoreListItem } from "./ScoreListItem";
import { Button, Divider, IconButton, Stack, Typography } from "@mui/joy";
import { ArrowBack } from "@mui/icons-material";
import { TopScore } from "../types";
import { useAuthContext } from "../hooks/AuthContext";
import { localStorageManager } from "../api/localStorageManager";

const emptyScoreList: TopScore[] = Array.from({ length: 15 }).map((_, i) => ({
  name: "...",
  score: 0,
}));

interface HighScoresProps {
  score: number;
  mainMenu: () => void;
}

export const HighScores: FC<HighScoresProps> = ({ score, mainMenu }) => {
  const [gotHighScore, setGotHighScore] = useState<boolean>(false);
  const [highScores, setHighScores] = useState<TopScore[]>();
  const [checked, setChecked] = useState<boolean>(false);

  const { api, user, modifyUser } = useAuthContext();

  const personalHigh =
    user?.highScore ?? parseInt(localStorageManager.get("high-score") ?? "0");

  const isPersonalHigh = score > (personalHigh ?? 0);

  useEffect(() => {
    (async () => {
      if (checked) return;
      if (isPersonalHigh && !!user) {
        await api.score.create({
          _id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          score,
          userId: user._id,
        });
        modifyUser({ highScore: score });
      }
      api.score.topScores().then((scores) => {
        const isHigh = isHighScore(score, scores, personalHigh);
        setHighScores(scores);
        setGotHighScore(isHigh);
      });
    })();
  }, [score]);

  if ((!gotHighScore && !isPersonalHigh) || checked) {
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
          {(highScores ?? emptyScoreList).map((info, i) => (
            <ScoreListItem num={i + 1} score={info} key={i} />
          ))}
        </Stack>
      </Stack>
    );
  }

  if (isPersonalHigh && api.getToken()) {
    return (
      <Stack gap="2rem">
        <Typography level="h2">
          You got a personal high score of {score}!
        </Typography>
        <Button
          style={{ maxWidth: "12rem", alignSelf: "center" }}
          onClick={() => {
            localStorageManager.set("high-score", score.toString());
            setChecked(true);
          }}
        >
          View Scores
        </Button>
      </Stack>
    );
  }

  return (
    <CreateAccount
      score={score}
      mainMenu={mainMenu}
      onSubmit={() => {
        localStorageManager.set("high-score", score.toString());
        setChecked(true);
      }}
    />
  );
};

export default HighScores;
