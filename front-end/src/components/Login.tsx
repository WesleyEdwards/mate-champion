import { ArrowBack } from "@mui/icons-material";
import {
  Stack,
  IconButton,
  Typography,
  Divider,
  Button,
  Input,
  Alert,
} from "@mui/joy";
import { FC, useState } from "react";
import { useAuthContext } from "../hooks/AuthContext";

export const Login: FC<{ mainMenu: () => void }> = ({ mainMenu }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");

  const [submitting, setSubmitting] = useState<boolean>(false);

  const { login } = useAuthContext();

  const submit = () => {
    if (!email || !password) {
      setError("Please enter a username and password");
      return;
    }
    setSubmitting(true);
    login({ email, password })
      .then(() => {
        setSubmitting(false);
        mainMenu();
      })
      .catch((err) => {
        setSubmitting(false);
        console.log(err);
        setError(err.message);
      });
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Stack width="100%" gap="1rem">
        <Stack direction="row" justifyContent="space-between">
          <IconButton onClick={mainMenu}>
            <ArrowBack />
          </IconButton>
          <Typography level="h2">Login</Typography>
          <div style={{ width: "2rem" }}></div>
        </Stack>
        <Divider />
        <Stack gap="1rem">
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
          <Button loading={submitting} onClick={submit}>
            Login
          </Button>

          {error && <Alert color="danger">{error}</Alert>}
        </Stack>
      </Stack>
    </form>
  );
};
