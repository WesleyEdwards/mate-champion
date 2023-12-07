import { FC, useState } from "react";
import { H2, StackHor } from "./MHComponents.tsx/Components";
import "./HighScores.css";
import instructions from "../assets/instructions.png";

type ControlsProps = { mainMenu: () => void };

export const Controls: FC<ControlsProps> = ({ mainMenu }) => {
  return (
    <>
      <StackHor>
        <span className="material-icons back-button" onClick={mainMenu}>
          {"arrow_back"}
        </span>
        <H2 style={{ alignSelf: "center" }}>Controls:</H2>
        <div style={{ width: "2rem" }}></div>
      </StackHor>
      <img
        src={instructions}
        alt="instructions"
        style={{ width: 250, height: 200 }}
      />
    </>
  );
};

export default Controls;
