import React, { FC } from "react";
import { emptyStats } from "../Game/constants";
import { lifeImage } from "./constants";
import { StackHor } from "./MHComponents.tsx/Components";
import { MHButton } from "./MHComponents.tsx/MHButton";
import { ScoreStats } from "./ScoreStats";

interface StatsDivProps {
  level: number | undefined;
  lives: number | undefined;
  score: number | undefined;
  ammo: number | undefined;
  disablePlay: boolean;
  handleClick: () => void;
  BtnText: string;
}

const widthOfDiv = 50 * emptyStats.lives;

export const StatsDiv: FC<StatsDivProps> = (props) => {
  const { level, lives, score, ammo, disablePlay, handleClick, BtnText } =
    props;
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
      <MHButton
        disabled={disablePlay}
        style={{ padding: "1rem 2rem" }}
        onClick={handleClick}
      >
        {BtnText}
      </MHButton>
      <ScoreStats level={level} score={score} ammo={ammo} />
    </StackHor>
  );
};

export default StatsDiv;
