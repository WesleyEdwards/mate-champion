import {Stack, Typography} from "@mui/joy"
import {FC} from "react"

import bullet from "../assets/mate_bullet_single.png"

export const ScoreStats: FC<{
  level: number | undefined
  score: number | undefined
  ammo: number | undefined
}> = ({level, score, ammo}) => {
  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        gap="12px"
      >
        <img src={bullet} alt="bullet" width="40px" />
        <Typography>{ammo}</Typography>
      </Stack>
      <Typography>Score: {score}</Typography>
      <Typography>Level: {level}</Typography>
    </>
  )
}
