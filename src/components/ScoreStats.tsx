import React, { FC } from "react";
import { StackVert, Typography } from "./MHComponents.tsx/Components";

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

interface ScoreStatsProps {
  level: number | undefined;
  score: number | undefined;
  ammo: number | undefined;
}

export const ScoreStats: FC<ScoreStatsProps> = (props) => {
  const { level, score, ammo } = props;
  return (
    <StackVert
      style={{
        alignItems: "end",
      }}
    >
      <StatsListItem label="ammo" value={ammo} />
      <StatsListItem label="level" value={level} />
      <StatsListItem label="score" value={score} />
    </StackVert>
  );
};
