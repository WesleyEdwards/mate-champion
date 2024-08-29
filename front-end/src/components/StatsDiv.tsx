import {FC} from "react"
import lifeImage from "../assets/heart.png"
import {ScoreStats} from "./ScoreStats"
import {Stack, Typography} from "@mui/joy"
import {PlayStats} from "../game/loopShared/models"

export const StatsDiv: FC<{stats: PlayStats}> = ({stats}) => {
  const {lives, level, score, ammo} = stats

  return (
    <Stack direction="row" alignItems="center" minHeight="50px" gap="2rem">
      <Stack direction="row" minWidth="10rem">
        {lives > 0 &&
          new Array(lives)
            .fill(null)
            .map((_, i) => (
              <img
                src={lifeImage}
                style={{objectFit: "contain"}}
                alt="heart"
                width="50px"
                height="50px"
                key={i}
              />
            ))}
      </Stack>
      <ScoreStats level={level} score={score} ammo={ammo} />
      <Typography ml="8rem">'Esc' to pause</Typography>
    </Stack>
  )
}

export default StatsDiv
