import React, { FC, useState } from "react";
import {
  Button,
  Divider,
  Stack,
  TextField,
  Textarea,
  Typography,
} from "@mui/joy";
import { useAuthContext } from "../hooks/AuthContext";

interface NewHighScoreProps {
  score: number;
  onSubmit: () => void;
}

export const NewHighScore: FC<NewHighScoreProps> = (props) => {
  const { onSubmit } = props;

  const { api } = useAuthContext();

  const [error, setError] = useState<string | null>(null);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmitNew = async () => {
    setDisableSubmit(true);
    setError(null);
    if (!name) return;
    if (name.length > 300) {
      setError("Name is too long");
      return setDisableSubmit(false);
    }
    // const sameUsers = await userAlreadyExists(name);
    try {
      const created = await api.auth.createAccount({
        _id: crypto.randomUUID(),
        name,
        email,
        password,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });

      return onSubmit();
    } catch (e) {
      setError(e as any);
      setDisableSubmit(false);
    }
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
          <Textarea value={name} onChange={(e) => setName(e.target.value)} />
          <Textarea value={email} onChange={(e) => setEmail(e.target.value)} />
          <Textarea
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
