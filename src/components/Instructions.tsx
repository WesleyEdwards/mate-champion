import React, { FC } from "react";
import { StackVert, Typography } from "./MHComponents.tsx/Components";

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
    </>
  );
};

export default Instructions;
