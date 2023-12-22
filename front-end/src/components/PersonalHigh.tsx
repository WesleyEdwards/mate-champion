import { Button, Typography } from "@mui/joy";
import { FC } from "react";
import { useAuthContext } from "../hooks/AuthContext";

export const PersonalHigh: FC = () => {
  const { user } = useAuthContext();
  if (user?.highScore !== undefined) {
    return (
      <Typography level="h4" sx={{ mt: "2rem" }}>
        Personal High Score: {user.highScore}
      </Typography>
    );
  }
  return null;
};
