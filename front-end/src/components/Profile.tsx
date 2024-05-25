import { Logout, Save, Undo } from "@mui/icons-material";
import { Button, IconButton, Input, Stack, Typography } from "@mui/joy";
import { FC } from "react";
import { ScreenProps } from "./GameEntry";
import { EditEmailOrName } from "./EditEmailOrName";
import { useNavigator } from "../hooks/UseNavigator";
import { useAuthContext } from "../hooks/useAuth";

export const Profile: FC<ScreenProps> = () => {
  const { resetStack, navigateTo } = useNavigator();
  const { user, logout } = useAuthContext();

  return (
    <Stack gap="1rem" mb={2}>
      {user ? (
        <>
          <EditEmailOrName type={"name"} />
          <EditEmailOrName type={"email"} />
          <Button
            onClick={() => {
              logout();
              resetStack();
            }}
            sx={{ alignSelf: "center", mt: "2rem" }}
            endDecorator={<Logout />}
          >
            Log Out
          </Button>
        </>
      ) : (
        <Stack my="2rem" gap="2rem">
          <Button
            sx={{ alignSelf: "center" }}
            onClick={() => navigateTo("createAccount")}
          >
            Create Account
          </Button>
          <Button
            sx={{ alignSelf: "center" }}
            variant="plain"
            onClick={() => navigateTo("login")}
          >
            Already have an account?
          </Button>
        </Stack>
      )}
    </Stack>
  );
};
