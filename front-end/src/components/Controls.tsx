import { FC } from "react";
import instructions from "../assets/instructions.png";
import { IconButton, Stack, Typography } from "@mui/joy";
import { ArrowBack } from "@mui/icons-material";

export const Controls: FC<{ mainMenu: () => void }> = ({ mainMenu }) => {
  return (
    <>
      <Stack direction="row">
        <IconButton onClick={mainMenu}>
          <ArrowBack />
        </IconButton>
        <Typography level="h2">Controls</Typography>
        <div style={{ width: "2rem" }}></div>
      </Stack>
      <img
        src={instructions}
        alt="instructions"
        style={{ width: 250, height: 200 }}
      />
    </>
  );
};

export default Controls;
