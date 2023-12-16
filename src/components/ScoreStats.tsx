import { Stack, Typography } from "@mui/joy";
import { FC } from "react";

import bullet from "../assets/bullet-hor.png";

export const ScoreStats: FC<{
  level: number | undefined;
  score: number | undefined;
  ammo: number | undefined;
}> = ({ level, score, ammo }) => {
  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="center" gap="5px">
        <img src={bullet} alt="bullet" width="30px" height="30px" />
        <Typography>{ammo}</Typography>
      </Stack>
      <Typography>Level: {level}</Typography>
      <Typography>Score: {score}</Typography>
    </>
  );
};
