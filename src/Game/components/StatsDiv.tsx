import React, { FC } from "react";

interface StatsListItemProps {
  label: string;
  value: number | undefined;
}

const StatsListItem: FC<StatsListItemProps> = (props) => {
  const { label, value } = props;
  return (
    <div
      style={{
        fontSize: "1.5rem",
        minWidth: "200px",
        flexDirection: "row",
      }}
      className="stats green-text"
      id={`${label}-stats`}
    >
      {value !== undefined && `${label}: ${value}`}
    </div>
  );
};

interface StatsDivProps {
  level: number | undefined;
  lives: number | undefined;
  score: number | undefined;
}

export const StatsDiv: FC<StatsDivProps> = (props) => {
  const { level, lives, score } = props;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBlock: "10px",
      }}
    >
      <StatsListItem label="level" value={level} />
      <StatsListItem label="lives" value={lives} />
      <StatsListItem label="score" value={score} />
    </div>
  );
};

export default StatsDiv;
