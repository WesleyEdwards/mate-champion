import { FC } from "react";
import { CreateAccount } from "./CreateAccount";
import { Button, Stack, Typography } from "@mui/joy";
import { useAuthContext } from "../hooks/AuthContext";
import { MCScreen, ScreenProps } from "./GameEntry";

export const PersonalHighScore: FC<ScreenProps> = ({ score, changeScreen }) => {
  const { user } = useAuthContext();

  if (user) {
    return (
      <Stack gap="2rem">
        <Typography level="h2">
          You got a personal high score of {score}!
        </Typography>
        <Button
          style={{ maxWidth: "12rem", alignSelf: "center" }}
          onClick={() => {
            changeScreen("highScores");
          }}
        >
          View Scores
        </Button>
      </Stack>
    );
  }

  return <CreateAccount score={score} changeScreen={changeScreen} />;
};
