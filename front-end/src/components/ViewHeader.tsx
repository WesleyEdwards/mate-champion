import { IconButton, Stack, Typography } from "@mui/joy";
import { MCScreen } from "./GameEntry";
import { ArrowBack } from "@mui/icons-material";
import { FC } from "react";

export const ViewHeader: FC<{
  changeScreen: (screen: MCScreen) => void;
  title: string;
}> = ({ changeScreen, title }) => {
  return (
    <Stack direction="row" justifyContent="space-between" width="100%">
      <IconButton onClick={() => changeScreen("home")}>
        <ArrowBack />
      </IconButton>
      <Typography level="h2">{title}</Typography>
      <div style={{ width: "2rem" }}></div>
    </Stack>
  );
};
