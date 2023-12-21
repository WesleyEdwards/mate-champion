import { FC, useEffect, useState } from "react";
import { isHighScore } from "../Firebase/FirebaseHelpers";
import { NewHighScore } from "./NewHighScore";
import { ScoreListItem } from "./ScoreListItem";
import { Button, Divider, IconButton, Stack, Typography } from "@mui/joy";
import { ArrowBack } from "@mui/icons-material";
import { Score, TopScore } from "../types";
import { useAuthContext } from "../hooks/AuthContext";

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
  const [personalHigh, setPersonalHigh] = useState<Score | null>();
  const [checked, setChecked] = useState<boolean>(false);

  const { api, user } = useAuthContext();

  const isPersonalHigh = score > (personalHigh?.score ?? 0);

  const checkPersonalHigh = () => {
    if (!api.getToken()) return;

    api.score.query(user ? { userId: user._id } : {}).then((scores) => {
      const high = scores.reduce<null | Score>((acc, curr) => {
        if (acc) {
          if (curr.score > acc.score) {
            return curr;
          }
        }
        return acc;
      }, null);
      if (score > (high?.score ?? 0)) {
        api.score.create({
          _id: crypto.randomUUID(),
          userId: user?._id ?? "",
          score,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      setPersonalHigh(high);
    });
  };

  useEffect(() => {
    if (checked) return;
    checkPersonalHigh();
  }, [highScores, score]);

  useEffect(() => {
    if (checked) return;
    api.score.topScores().then((scores) => {
      const isHigh = isHighScore(score, scores, personalHigh?.score ?? 0);
      setHighScores(scores);
      setGotHighScore(isHigh);
    });
  }, [personalHigh, score]);

  if ((!gotHighScore && !personalHigh) || checked) {
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
            localStorage.setItem("mate-high-score", score.toString());
            setChecked(true);
          }}
        >
          View Scores
        </Button>
      </Stack>
    );
  }

  return (
    <NewHighScore
      score={score}
      onSubmit={() => {
        localStorage.setItem("mate-high-score", score.toString());
        setChecked(true);
      }}
    />
  );
};

export default HighScores;
