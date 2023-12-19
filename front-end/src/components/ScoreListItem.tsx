import { FC } from "react";
import { Stack, Typography } from "@mui/joy";
import { TopScore } from "../types";

export const ScoreListItem: FC<{
  score: TopScore;
  num: number;
}> = ({ score, num }) => {
  return (
    <Stack direction="row" justifyContent="spaceBetween" alignItems="center">
      <Typography sx={{ width: "3rem" }}>{num}</Typography>
      <Typography
        overflow="hidden"
        whiteSpace="nowrap"
        textOverflow="ellipsis"
        sx={{ width: "16rem", mr: "1rem" }}
        title={score.name}
      >
        {score.name}
      </Typography>
      <Typography>{score.score}</Typography>
    </Stack>
  );
};
