import { FC } from "react";
import { PlayerScore } from "../Game/models";
import { MHTypography } from "./MHComponents.tsx/MHTypography";
import "./HighScores.css";

interface ScoreListItemProps {
  score: PlayerScore;
  num: number;
}

export const ScoreListItem: FC<ScoreListItemProps> = (props) => {
  const { score, num } = props;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "1rem",
      }}
    >
      <div
        className="score-list-item green-text"
        title={score.name}
      >{`${num} - ${score.name}`}</div>
      <MHTypography>{`(${score.score})`}</MHTypography>
    </div>
  );
};
