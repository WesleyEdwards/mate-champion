import { FC, useState } from "react";
import { H2, StackHor } from "./MHComponents.tsx/Components";
import "./HighScores.css";
import { instructionsUrl } from "../Game/Drawing/drawingUtils";

type ControlsProps = { mainMenu: () => void };

export const Controls: FC<ControlsProps> = ({ mainMenu }) => {
  return (
    <>
      <StackHor style={{ justifyContent: "space-between" }}>
        <span className="material-icons back-button" onClick={mainMenu}>
          {"arrow_back"}
        </span>
        <H2 style={{ alignSelf: "center" }}>Controls:</H2>
        <div style={{ width: "2rem" }}></div>
      </StackHor>
      <img
        src={instructionsUrl}
        alt="instructions"
        style={{ width: 250, height: 200 }}
      />
    </>
  );
};

export default Controls;
