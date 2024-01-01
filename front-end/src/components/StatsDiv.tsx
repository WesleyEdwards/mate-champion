import { FC } from "react";
import lifeImage from "../assets/heart.png";
import { ScoreStats } from "./ScoreStats";
import { PlayStats } from "../Game/helpers/types";
import { Stack } from "@mui/joy";
import { devSettings } from "../Game/devSettings";
import { CourseBuilderSettings } from "../Game/devTools/CourseBuilderSettings";

export const StatsDiv: FC<{ stats: PlayStats }> = ({ stats }) => {
  const { lives, level, score, ammo } = stats;

  return (
    <Stack direction="row" alignItems="center" minHeight="50px" gap="2rem">
      <Stack direction="row" minWidth="10rem">
        {lives &&
          new Array(lives)
            .fill(null)
            .map((_, i) => (
              <img
                src={lifeImage}
                style={{ objectFit: "contain" }}
                alt="heart"
                width="50px"
                height="50px"
                key={i}
              />
            ))}
      </Stack>
      <ScoreStats level={level} score={score} ammo={ammo} />
      {devSettings.courseBuilder && <CourseBuilderSettings />}
    </Stack>
  );
};

export default StatsDiv;