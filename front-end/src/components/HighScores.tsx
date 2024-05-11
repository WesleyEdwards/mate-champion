import { FC, useEffect, useState } from "react";
import { ScoreListItem } from "./ScoreListItem";
import {
  Alert,
  Button,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/joy";
import { TopScore } from "../types";
import { useAuthContext } from "../hooks/AuthContext";
import { localStorageManager } from "../api/localStorageManager";
import { ScreenProps } from "./GameEntry";

export const HighScores: FC<ScreenProps> = ({ score }) => {
  const [highScores, setHighScores] = useState<TopScore[]>();
  const [error, setError] = useState<string>();
  const { api } = useAuthContext();

  useEffect(() => {
    api.score
      .topScores()
      .then(setHighScores)
      .catch(() => setError("Unable to load high scores"));
  }, []);

  return (
    <Stack gap="1rem">
      <Stack alignSelf="center">
        {!highScores &&
          !error &&
          Array.from({ length: 15 }).map((_, i) => (
            <Skeleton
              variant="rectangular"
              key={i}
              sx={{ mb: "0.5rem" }}
              width="20rem"
              height="1rem"
            />
          ))}
        {highScores?.map((info, i) => (
          <ScoreListItem num={i + 1} score={info} key={i} />
        ))}
      </Stack>
      {!api.getToken() &&
        highScores?.some(
          (s) => s.score < localStorageManager.get("high-score") ?? 0
        ) && (
          <Alert sx={{ maxWidth: "22rem", alignSelf: "center" }}>
            Create an account or log in so you show up on the leaderboard!
          </Alert>
        )}
      {error && (
        <Alert color="danger" sx={{ maxWidth: "22rem", alignSelf: "center" }}>
          {error}
        </Alert>
      )}
      {!!score && (
        <>
          <Divider />
          <Stack direction="row" justifyContent="center">
            <Typography level="h4">Your Score: {score}</Typography>
          </Stack>
        </>
      )}
    </Stack>
  );
};

export default HighScores;
