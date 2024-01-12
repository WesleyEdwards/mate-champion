import {
  ArrowBack,
  Check,
  Edit,
  Logout,
  Save,
  Undo,
} from "@mui/icons-material";
import { Button, IconButton, Input, Stack, Typography } from "@mui/joy";
import { FC, useEffect, useState } from "react";
import { useAuthContext } from "../hooks/AuthContext";
import { MCScreen, ScreenProps } from "./GameEntry";

export const Profile: FC<ScreenProps> = ({ changeScreen }) => {
  const { user, api, modifyUser, logout } = useAuthContext();

  const [displayName, setDisplayName] = useState<string>(user?.name ?? "");
  const [editingName, setEditingName] = useState<boolean>(false);

  return (
    <Stack gap="1rem">
      <Stack direction="row" justifyContent="space-between" width="100%">
        <IconButton onClick={() => changeScreen("home")}>
          <ArrowBack />
        </IconButton>
        <Typography level="h2">Profile</Typography>
        <div style={{ width: "2rem" }}></div>
      </Stack>

      {user ? (
        <>
          <Stack
            direction="row"
            minWidth="32rem"
            justifyContent="space-between"
          >
            <Stack direction="row" alignItems="center" gap="1rem">
              <Typography level="h4">Name:</Typography>
              {editingName ? (
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              ) : (
                <Typography level="h4">{user.name}</Typography>
              )}
            </Stack>
            {editingName ? (
              <Stack direction="row" gap="1rem">
                <IconButton
                  onClick={() => {
                    setEditingName(false);
                    setDisplayName(user.name);
                  }}
                >
                  <Undo />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setEditingName(false);
                    modifyUser({ name: displayName });
                    api.user.modify(user._id, { name: displayName });
                  }}
                >
                  <Check />
                </IconButton>
              </Stack>
            ) : (
              <IconButton onClick={() => setEditingName(true)}>
                <Edit />
              </IconButton>
            )}
          </Stack>
          {user.email && (
            <Typography level="h4">Email: {user.email}</Typography>
          )}
          <Button
            onClick={() => {
              logout();
              changeScreen("home");
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
            onClick={() => changeScreen("createAccount")}
          >
            Create Account
          </Button>
          <Button
            sx={{ alignSelf: "center" }}
            variant="plain"
            onClick={() => changeScreen("login")}
          >
            Already have an account?
          </Button>
        </Stack>
      )}
    </Stack>
  );
};
