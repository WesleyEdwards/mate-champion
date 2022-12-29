import React, { FC } from "react";
import {
  StackHor,
  StackVert,
  Typography,
} from "./MHComponents.tsx/Components";

interface StatsListItemProps {
  label: string;
  value: number | undefined;
}

const StatsListItem: FC<StatsListItemProps> = (props) => {
  const { label, value } = props;
  return (
    <Typography style={{ margin: 0, fontSize: "1.5rem" }}>
      {value !== undefined && `${label}: ${value}`}
    </Typography>
  );
};

interface StatsDivProps {
  level: number | undefined;
  lives: number | undefined;
  score: number | undefined;
  ammo: number | undefined;
}

export const StatsDiv: FC<StatsDivProps> = (props) => {
  const { level, lives, score, ammo } = props;

  return (
    <StackHor
      style={{
        justifyContent: "space-between",
        paddingBlock: "10px",
      }}
    >
      <StackHor>
        {lives &&
          new Array(lives).fill(null).map((_, i) => (
            <img
              src="https://user-images.githubusercontent.com/97990557/209986272-22157ab1-35ba-4ff1-9173-f72696174670.png"
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
      <StackVert
        style={{
          alignItems: "end",
        }}
      >
        <StatsListItem label="ammo" value={ammo} />
        <StatsListItem label="level" value={level} />
        <StatsListItem label="score" value={score} />
      </StackVert>
    </StackHor>
  );
};

export default StatsDiv;
