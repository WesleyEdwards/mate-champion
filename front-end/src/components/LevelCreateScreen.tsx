import { FC, useEffect, useState } from "react";
import { ScreenProps } from "./GameEntry";
import { ViewHeader } from "./ViewHeader";
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
} from "@mui/joy";
import { Add, Delete, Edit } from "@mui/icons-material";
import { useAuthContext } from "../hooks/AuthContext";
import { LevelInfo } from "../Game/models";
import { useLevelContext } from "../hooks/LevelsContext";

export const LevelCreateScreen: FC<ScreenProps> = ({ changeScreen }) => {
  const { api, user } = useAuthContext();
  const {
    editingLevel,
    setEditingLevel,
    modifyLevel,
    saveLevelToDb,
    ownedLevels,
    setOwnedLevels,
  } = useLevelContext();

  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<LevelInfo>();

  if (!user) throw new Error("User must be authenticated");

  useEffect(() => {
    if (ownedLevels) return;
    setOwnedLevels(undefined);
    api?.level.query({ owner: user?._id }).then(setOwnedLevels);
  }, []);

  return (
    <>
      <ViewHeader changeScreen={changeScreen} title="Level Creator" />
      <Stack my={4} gap={4}>
        {(() => {
          if (editingLevel) {
            return (
              <Stack justifyContent="space-between" height="12rem">
                <Stack direction="row" alignItems="center" gap="1rem">
                  <Typography>Editing:</Typography>
                  <Input
                    placeholder="Name"
                    value={editingLevel.name}
                    onChange={(e) => modifyLevel({ name: e.target.value })}
                  />
                </Stack>
                <Stack
                  direction="row"
                  sx={{ alignSelf: "flex-end" }}
                  gap="1rem"
                >
                  <Button variant="plain" onClick={() => setEditingLevel(null)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() =>
                      saveLevelToDb().then((res) => {
                        setOwnedLevels((prev) =>
                          prev?.map((l) => (l._id === res._id ? res : l))
                        );
                        setEditingLevel(null);
                      })
                    }
                  >
                    Save
                  </Button>
                </Stack>
              </Stack>
            );
          }
          if (!ownedLevels)
            return (
              <CircularProgress sx={{ width: "100%", alignSelf: "center" }} />
            );
          return (
            <>
              <Stack gap="1rem">
                {ownedLevels.map((level) => {
                  return (
                    <Card variant="soft" key={level._id}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography level="h4">{level.name}</Typography>
                        <Stack direction="row" gap="1rem">
                          <IconButton
                            color="danger"
                            onClick={() => setDeleting(level)}
                          >
                            <Delete />
                          </IconButton>
                          <IconButton onClick={() => setEditingLevel(level)}>
                            <Edit />
                          </IconButton>
                        </Stack>
                      </Stack>
                    </Card>
                  );
                })}
              </Stack>
              {ownedLevels.length > 0 && <Divider>or</Divider>}

              <Button
                onClick={() => {
                  setCreating(true);
                  api.level
                    .create({
                      _id: crypto.randomUUID(),
                      owner: user._id,
                      public: false,
                      name: "My level",
                      opponents: { grog: [] },
                      packages: [],
                      floors: [{ x: -500, width: 7000, color: "green" }],
                      platforms: [],
                    })
                    .then((created) => {
                      setCreating(false);
                      setOwnedLevels((prev) =>
                        prev ? [...prev, created] : prev
                      );
                      return setEditingLevel(created);
                    });
                }}
                loading={creating}
                sx={{ width: "12rem", alignSelf: "center" }}
                endDecorator={<Add />}
              >
                Create New Level
              </Button>
            </>
          );
        })()}
      </Stack>
      <Modal open={!!deleting} onClose={() => setDeleting(undefined)}>
        <ModalDialog>
          <DialogTitle>Delete Level</DialogTitle>
          <DialogContent>
            Are you sure you want to delete {deleting?.name}? This action cannot
            be undone
          </DialogContent>
          <Button
            endDecorator={<Delete />}
            color="danger"
            sx={{ alignSelf: "flex-end" }}
            onClick={() => {
              api.level.delete(deleting?._id ?? "");
              setOwnedLevels((prev) =>
                prev?.filter((l) => l._id !== deleting?._id)
              );
              setDeleting(undefined);
              setEditingLevel(null);
            }}
          >
            Delete
          </Button>
        </ModalDialog>
      </Modal>
    </>
  );
};
