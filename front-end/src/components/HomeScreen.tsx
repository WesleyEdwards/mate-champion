import { FC } from "react";
import { ScreenProps } from "./GameEntry";
import { Button, Stack, Typography } from "@mui/joy";
import Instructions from "./Instructions";
import { PlayScreen } from "./PlayScreen";
import { useAuthContext } from "../hooks/useAuth";
import { PersonalHigh } from "./PersonalHigh";
import { useNavigator } from "../hooks/UseNavigator";
import mateSingle from "../assets/champ/mate-single.png";

export const HomeScreen: FC<ScreenProps> = ({ modifyStats }) => {
  const { user } = useAuthContext();
  const { navigateTo } = useNavigator();
  return (
    <Stack width="100%" alignItems={"center"} sx={{ width: "722px" }}>
      <Typography level="h1">Mate Champion</Typography>
      <Instructions />
      <img
        style={{
          margin: "4px auto 24px",
          width: "80px",
        }}
        src={mateSingle}
      />
      <PlayScreen
        modifyStats={modifyStats}
        screen={"home"}
        setScreen={navigateTo}
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
          onClick={() => navigateTo("highScores")}
        >
          High Scores
        </Button>
        <Button
          variant="outlined"
          sx={{ width: "10rem" }}
          onClick={() => navigateTo("controls")}
        >
          Controls
        </Button>
        <Button
          variant="outlined"
          sx={{ width: "10rem" }}
          onClick={() => navigateTo("profile")}
        >
          Profile
        </Button>
        {user?.userType === "Editor" ||
          (user?.userType === "Admin" && (
            <Button
              variant="outlined"
              sx={{ width: "10rem" }}
              onClick={() => navigateTo("levelEditor")}
            >
              Level Editor
            </Button>
          ))}
      </Stack>
      <PersonalHigh />
    </Stack>
  );
};
