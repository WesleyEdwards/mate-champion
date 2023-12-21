import { FC, useState } from "react";
import { Alert, Button, Divider, Input, Stack, Typography } from "@mui/joy";
import { useAuthContext } from "../hooks/AuthContext";

interface NewHighScoreProps {
  score: number;
  onSubmit: () => void;
}

export const NewHighScore: FC<NewHighScoreProps> = ({ score, onSubmit }) => {
  const { createAccount } = useAuthContext();

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
      createAccount({
        _id: crypto.randomUUID(),
        name,
        email,
        password,
        highScore: score,
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
      <Typography level="h2">Score: {score}</Typography>
      <Divider sx={{ my: "1rem" }} />
      <Stack style={{ gap: "1rem" }}>
        <Stack>
          <Typography>That&apos;s a new record for you!</Typography>
          <Typography>To save your score, create an account</Typography>
        </Stack>
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          disabled={disableSubmit || [name, email, password].some((v) => !v)}
          onClick={handleSubmitNew}
          type="submit"
        >
          Save
        </Button>
        {error && <Alert color="danger">{error}</Alert>}
      </Stack>
    </Stack>
  );
};
