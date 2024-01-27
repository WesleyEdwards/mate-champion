import { FC, useState } from "react";
import {
  Alert,
  Button,
  Divider,
  IconButton,
  Input,
  Stack,
  Typography,
} from "@mui/joy";
import { useAuthContext } from "../hooks/AuthContext";
import { ArrowBack } from "@mui/icons-material";
import { ScreenProps } from "./GameEntry";

export const CreateAccount: FC<ScreenProps> = ({ score, changeScreen }) => {
  const { createAccount } = useAuthContext();

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmitNew = async () => {
    setSubmitting(true);
    setError(null);
    if (!name) return;
    if (name.length > 300) {
      setError("Name is too long");
      return setSubmitting(false);
    }
    try {
      await createAccount({
        _id: crypto.randomUUID(),
        name,
        email: email === "" ? undefined : email,
        password,
        highScore: score ?? 0,
        admin: false,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });

      return changeScreen("home");
    } catch (e) {
      setError("Error creating account");
      setSubmitting(false);
    }
  };

  return (
    <Stack mb={2}>
      <Stack direction="row" justifyContent="space-between">
        <IconButton onClick={() => changeScreen("home")}>
          <ArrowBack />
        </IconButton>
        {score ? (
          <Typography level="h2">Score: {score}</Typography>
        ) : (
          <Typography level="h2">Create Account</Typography>
        )}
        <div style={{ width: "2rem" }}></div>
      </Stack>
      <Divider sx={{ my: "1rem" }} />
      <Stack style={{ gap: "1rem" }}>
        {score !== undefined && score !== 0 && (
          <Stack>
            <Typography>That&apos;s a new record for you!</Typography>
            <Typography>To save your score, create an account</Typography>
          </Stack>
        )}
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          placeholder="Email (Optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          disabled={[name, password].some((v) => !v)}
          loading={submitting}
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
