import React, { FC, useState } from "react";
import { userAlreadyExists } from "../Firebase/FirebaseHelpers";
import { Button, Divider, Stack, Typography } from "@mui/joy";

interface NewHighScoreProps {
  score: number;
  onSubmit: (name: string) => Promise<void>;
}

export const NewHighScore: FC<NewHighScoreProps> = (props) => {
  const { onSubmit } = props;

  const [error, setError] = useState<string | null>(null);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [name, setName] = useState("");

  const handleSubmitNew = async () => {
    setDisableSubmit(true);
    setError(null);
    if (!name) return;
    if (name.length > 300) {
      setError("Name is too long");
      return setDisableSubmit(false);
    }
    const sameUsers = await userAlreadyExists(name);

    if (sameUsers) {
      setError("Name is already exists");
      setDisableSubmit(false);
      return;
    }
    return onSubmit(name);
  };

  return (
    <Stack>
      <Typography level="h2">Game Over!</Typography>
      <Typography level="h3">
        You got a high score!
        <Divider />
        To receive credit, Enter your name:
      </Typography>
      <Stack style={{ gap: "1rem" }}>
        <Stack style={{ gap: "1rem" }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            disabled={name.length === 0 || disableSubmit}
            onClick={handleSubmitNew}
            type="submit"
          >
            Submit
          </Button>
        </Stack>
        {error && <Typography>{error}</Typography>}
      </Stack>
    </Stack>
  );
};
