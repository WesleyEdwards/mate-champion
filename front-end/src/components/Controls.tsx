import { FC } from "react";
import instructions from "../assets/instructions.png";
import { IconButton, Stack, Typography } from "@mui/joy";
import { ArrowBack } from "@mui/icons-material";
import { ScreenProps } from "./GameEntry";
import { ViewHeader } from "./ViewHeader";

export const Controls: FC<ScreenProps> = (props) => {
  return (
    <Stack gap="1rem">
      <ViewHeader title={"Controls"} {...props} />
      <div
        style={{
          width: 750,
          borderRadius: 10,
          height: 600,
          background: `linear-gradient(rgba(50, 56, 62, 0.5), rgba(50, 56, 62, 0.5)),url("${instructions}")`,
          backgroundSize: "cover",
        }}
      ></div>
    </Stack>
  );
};

export default Controls;
