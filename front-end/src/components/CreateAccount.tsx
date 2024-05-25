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
import { useNavigator } from "../hooks/UseNavigator";

export const CreateAccount: FC<ScreenProps> = ({ score }) => {
  const { createAccount } = useAuthContext();
  const { resetStack, goBack } = useNavigator();

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmitNew = async () => {
    if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)) {
      setError("Invalid email");
      return;
    }

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
        userType: "User",
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });

      return resetStack();
    } catch (e) {
      setError("Error creating account");
      setSubmitting(false);
    }
  };

  return (
    <Stack>
      <Stack direction="row" justifyContent="space-between">
        <IconButton onClick={goBack}>
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
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Typography variant="soft" level="body-xs">
          Your email will be used in case you forget your password
        </Typography>
        {error && <Alert color="danger">{error}</Alert>}
        <Button
          disabled={[name, password, email].some((v) => !v)}
          loading={submitting}
          onClick={handleSubmitNew}
          type="submit"
        >
          Create Account
        </Button>
      </Stack>
    </Stack>
  );
};
