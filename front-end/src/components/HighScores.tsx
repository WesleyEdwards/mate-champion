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

  const { api, user } = useAuthContext();

  const [savedScore, setSavedScore] = useState<boolean>(false);

  const handleSubmit = (name: string) => {
    // return handleSubmitName(name, score).then(() => {
    //   setGotHighScore(false);
    //
    // });
  };

  useEffect(() => {
    if (!highScores || personalHigh === undefined) return;
    const isHigh = isHighScore(score, highScores, personalHigh?.score ?? 0);

    setGotHighScore(isHigh);
    if (isHigh) {
      setSavedScore(false);
    }
  }, [highScores, score]);

  useEffect(() => {
    api.score.topScores().then(setHighScores);
    api.score.query(user ? { userId: user._id } : {}).then((scores) => {
      const high = scores.reduce<null | Score>((acc, curr) => {
        if (acc) {
          if (curr.score > acc.score) {
            return curr;
          }
        }
        return acc;
      }, null);
      setPersonalHigh(high);
    });
  }, []);

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
          {(highScores ?? emptyScoreList).map((info, i) => (
            <ScoreListItem num={i + 1} score={info} key={i} />
          ))}
        </Stack>
      </Stack>
    );
  }

  if (!personalHigh) {
    return <NewHighScore score={score} onSubmit={() => setSavedScore(true)} />;
  }

  return (
    <Stack>
      <Typography>New High Score of {score}!</Typography>
      <Button
        style={{ padding: "1rem" }}
        onClick={() => handleSubmit(user?.name ?? "")}
      >
        View Scores
      </Button>
    </Stack>
  );
};

export default HighScores;
