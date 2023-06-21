import { FC, useState } from "react";
import { H2, StackHor } from "./MHComponents.tsx/Components";
import "./HighScores.css";

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
        src="https://user-images.githubusercontent.com/97990557/210724055-8d8862af-16b0-442e-ba70-e89a389578cd.png"
        alt="instructions"
        style={{ width: 250, height: 200 }}
      />
    </>
  );
};

export default Controls;
