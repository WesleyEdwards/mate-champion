import { FC } from "react";
import { PlayerScore } from "../Game/models";

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
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        className="score-list-item green-text"
        title={score.name}
      >{`${num} - ${score.name}`}</div>
      <div>{score.score}</div>
    </div>
  );
};
