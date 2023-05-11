import React, { FC } from "react";
import { StackVert, Typography } from "./MHComponents.tsx/Components";
import { MHButton } from "./MHComponents.tsx/MHButton";
import "./Instructions.css";

export const Instructions: FC = () => {
  return (
    <>
      <StackVert style={{ alignItems: "start" }}>
        <Typography style={{ overflow: "wrap", maxWidth: "500px" }}>
          The objective of this game is to survive the wrath of all who seek to
          destroy the good reputation of mate. Try to make it as far as you can
          without getting caught.
        </Typography>
        <Typography style={{ overflow: "wrap", maxWidth: "500px" }}>
          Collect Mate to help you survive longer, avoid the lava, and be
          careful. Good luck.
        </Typography>
      </StackVert>
      <img
        src="https://user-images.githubusercontent.com/97990557/210724055-8d8862af-16b0-442e-ba70-e89a389578cd.png"
        alt="instructions"
        style={{ width: 250, height: 200 }}
      />
      <a href="https://server-project-3a101.web.app">
        <div className="original-game">original game</div>
      </a>
    </>
  );
};

export default Instructions;
