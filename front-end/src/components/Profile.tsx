import { ArrowBack, Check, Edit, Save, Undo } from "@mui/icons-material";
import { Button, IconButton, Input, Stack, Typography } from "@mui/joy";
import { FC, useEffect, useState } from "react";
import { useAuthContext } from "../hooks/AuthContext";

export const Profile: FC<{ mainMenu: () => void }> = ({ mainMenu }) => {
  const { user, api, modifyUser } = useAuthContext();

  const [displayName, setDisplayName] = useState<string>(user?.name ?? "");
  const [editingName, setEditingName] = useState<boolean>(false);

  return (
    <Stack gap="1rem">
      <Stack direction="row" justifyContent="space-between" width="100%">
        <IconButton onClick={mainMenu}>
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
              <Typography level="h4">Username:</Typography>
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
                    api.user.changeName(displayName);
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
          <Typography level="h4">Email: {user.email}</Typography>
        </>
      ) : (
        <Button>Create Account</Button>
      )}
    </Stack>
  );
};
