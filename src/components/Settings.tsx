import { FC, useState } from "react";
import { H2, StackHor } from "./MHComponents.tsx/Components";
import "./HighScores.css";

type SettingsProps = { mainMenu: () => void };

export const Settings: FC<SettingsProps> = ({ mainMenu }) => {
  return (
    <>
      <StackHor style={{ justifyContent: "space-between" }}>
        <span className="material-icons back-button" onClick={mainMenu}>
          {"arrow_back"}
        </span>
        <H2 style={{ alignSelf: "center" }}>Settings:</H2>
        <div style={{ width: "2rem" }}></div>
      </StackHor>
      <div>Sound</div>
    </>
  );
};

export default Settings;
