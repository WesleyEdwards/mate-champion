import { FC } from "react";
import instructions from "../assets/instructions.png";
import { IconButton, Stack, Typography } from "@mui/joy";
import { ArrowBack } from "@mui/icons-material";

export const Controls: FC<{ mainMenu: () => void }> = ({ mainMenu }) => {
  return (
    <Stack gap="1rem">
      <Stack direction="row" justifyContent="space-between" width="100%">
        <IconButton onClick={mainMenu}>
          <ArrowBack />
        </IconButton>
        <Typography level="h2">Controls</Typography>
        <div style={{ width: "2rem" }}></div>
      </Stack>
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
