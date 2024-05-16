import { FC, useEffect, useState } from "react";
import { ScreenProps } from "./GameEntry";
import {
  Button,
  Divider,
  Input,
  Stack,
  Typography,
  CircularProgress,
  Card,
  IconButton,
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  Tooltip,
} from "@mui/joy";
import { Add } from "@mui/icons-material";
import { useAuthContext } from "../hooks/AuthContext";
import { useLevelContext } from "../hooks/useLevels";

export const CreateNewLevel: FC<{
  onCreate: () => void;
}> = ({ onCreate }) => {
  const { user, api } = useAuthContext();
  const { setEditingLevel, setOwnedLevels } = useLevelContext();

  const [creating, setCreating] = useState(false);

  const [makingNew, setMakingNew] = useState<string>();

  if (!user) throw new Error("User must be authenticated");

  const createLevel = async (name: string) => {
    const created = await api.level.create({
      _id: crypto.randomUUID(),
      owner: user?._id ?? "",
      creatorName: user?.name ?? "",
      endPosition: 4500,
      public: false,
      name: name,
      opponents: { grog: [] },
      packages: [],
      floors: [{ x: -500, width: 7000, color: "green" }],
      platforms: [],
    });
    setEditingLevel(created);
    setOwnedLevels((prev) => (prev ? [...prev, created] : prev));
    return created;
  };

  return (
    <>
      <Button
        onClick={() => {
          setMakingNew("");
        }}
        loading={creating}
        sx={{ width: "12rem", alignSelf: "center" }}
        endDecorator={<Add />}
      >
        Create New Level
      </Button>

      <Modal
        open={makingNew !== undefined}
        onClose={() => setMakingNew(undefined)}
      >
        <ModalDialog>
          <DialogTitle>New Level</DialogTitle>
          <DialogContent>Choose a name for your new level</DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setCreating(true);
              createLevel(makingNew ?? "").then(() => {
                setCreating(false);
                onCreate();
              });
            }}
          >
            <Stack gap="1rem">
              <Input
                value={makingNew}
                onChange={(e) => setMakingNew(e.target.value)}
                placeholder="My level"
              />
              <Button
                disabled={!makingNew}
                sx={{ alignSelf: "flex-end" }}
                type="submit"
              >
                Create
              </Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </>
  );
};
