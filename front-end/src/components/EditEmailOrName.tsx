import { Undo, Check, Edit } from "@mui/icons-material";
import { Stack, Typography, Input, IconButton } from "@mui/joy";
import { FC, useState } from "react";
import { useAuthContext } from "../hooks/useAuth";
import { camelCaseToTitleCase } from "../helpers";

export const EditEmailOrName: FC<{ type: "name" | "email" }> = ({ type }) => {
  const { user, api, modifyUser } = useAuthContext();
  if (!user) {
    throw new Error("This component requires the user to not be null");
  }
  const [displayString, setDisplayString] = useState<string>(
    type === "name" ? user.name : user.email ?? ""
  );
  const [editingString, setEditingString] = useState<boolean>(false);

  return (
    <Stack direction="row" minWidth="32rem" justifyContent="space-between">
      <Stack direction="row" alignItems="center" gap="1rem">
        <Typography level="h4">{camelCaseToTitleCase(type)}:</Typography>
        {editingString ? (
          <Input
            value={displayString}
            onChange={(e) => setDisplayString(e.target.value)}
          />
        ) : (
          <Typography level="h4">{user[type]}</Typography>
        )}
      </Stack>
      {editingString ? (
        <Stack direction="row" gap="1rem">
          <IconButton
            onClick={() => {
              setEditingString(false);
              setDisplayString(user[type] ?? "");
            }}
          >
            <Undo />
          </IconButton>
          <IconButton
            onClick={() => {
              setEditingString(false);
              modifyUser({ [type]: displayString });
              api.user.modify(user._id, { [type]: displayString });
            }}
          >
            <Check />
          </IconButton>
        </Stack>
      ) : (
        <IconButton onClick={() => setEditingString(true)}>
          <Edit />
        </IconButton>
      )}
    </Stack>
  );
};
