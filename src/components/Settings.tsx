import { FC, useState } from "react";
import { IconButton, Stack, Typography } from "@mui/joy";
import { ArrowBack } from "@mui/icons-material";

export const Settings: FC<{ mainMenu: () => void }> = ({ mainMenu }) => {
  return (
    <>
      <Stack direction="row" style={{ justifyContent: "space-between" }}>
        <IconButton>
          <ArrowBack />
        </IconButton>
        <Typography>Settings:</Typography>
        <div style={{ width: "2rem" }}></div>
      </Stack>
      <Typography>Sound</Typography>
    </>
  );
};

export default Settings;
