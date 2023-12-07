import React, { FC } from "react";
import { lifeImage } from "./constants";
import { StackHor } from "./MHComponents.tsx/Components";
import { ScoreStats } from "./ScoreStats";
import { emptyStats } from "../Game/helpers/utils";
import { PlayStats } from "../Game/helpers/types";

const widthOfDiv = 50 * emptyStats.lives;

export const StatsDiv: FC<{ stats: PlayStats }> = ({ stats }) => {
  const { lives, level, score, ammo } = stats;

  return (
    <StackHor
      style={{
        justifyContent: "space-between",
        paddingBlock: "10px",
      }}
    >
      <StackHor
        style={{
          minWidth: `${widthOfDiv}px`,
          justifyContent: "start",
        }}
      >
        {lives &&
          new Array(lives).fill(null).map((_, i) => (
            <img
              src={lifeImage}
              style={{
                objectFit: "contain",
              }}
              alt="heart"
              width="50px"
              height="50px"
              key={i}
            />
          ))}
      </StackHor>
      <ScoreStats level={level} score={score} ammo={ammo} />
    </StackHor>
  );
};

export default StatsDiv;
