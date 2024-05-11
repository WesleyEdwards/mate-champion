import { FC } from "react";
import { ScreenProps } from "./GameEntry";
import { Button, Stack, Typography } from "@mui/joy";
import Instructions from "./Instructions";
import { PlayScreen } from "./PlayScreen";
import { useAuthContext } from "../hooks/AuthContext";
import { PersonalHigh } from "./PersonalHigh";

export const HomeScreen: FC<ScreenProps> = ({ changeScreen, modifyStats }) => {
  const { user } = useAuthContext();
  return (
    <Stack width="100%" alignItems={"center"}>
      <Typography level="h1">Mate Champion</Typography>
      <Instructions />
      <PlayScreen
        modifyStats={modifyStats}
        screen={"home"}
        setScreen={changeScreen}
      />
      <Stack
        direction="row"
        width="100%"
        justifyContent="center"
        gap="1rem"
        mb={4}
      >
        <Button
          variant="outlined"
          sx={{ width: "10rem" }}
          onClick={() => changeScreen("highScores")}
        >
          High Scores
        </Button>
        <Button
          variant="outlined"
          sx={{ width: "10rem" }}
          onClick={() => changeScreen("controls")}
        >
          Controls
        </Button>
        <Button
          variant="outlined"
          sx={{ width: "10rem" }}
          onClick={() => changeScreen("profile")}
        >
          Profile
        </Button>
        {user?.userType === "Editor" ||
          (user?.userType === "Admin" && (
            <Button
              variant="outlined"
              sx={{ width: "10rem" }}
              onClick={() => changeScreen("levelEditor")}
            >
              LevelEditor
            </Button>
          ))}
      </Stack>
      <PersonalHigh />
    </Stack>
  );
};
