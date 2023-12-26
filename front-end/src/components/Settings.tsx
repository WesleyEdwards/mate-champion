import { FC } from "react";
import { Typography } from "@mui/joy";
import { ScreenProps } from "./GameEntry";
import { ViewHeader } from "./ViewHeader";

export const Settings: FC<ScreenProps> = ({ changeScreen }) => {
  return (
    <>
      <ViewHeader changeScreen={changeScreen} title="Settings" />
      <Typography>Sound</Typography>
    </>
  );
};

export default Settings;
