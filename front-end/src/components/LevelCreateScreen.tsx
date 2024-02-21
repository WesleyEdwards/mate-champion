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
  Tooltip,
} from "@mui/joy";
import { Add, Delete, Edit } from "@mui/icons-material";
import { useAuthContext } from "../hooks/AuthContext";
import { LevelInfo, PartialLevelInfo } from "../Game/models";
import { useLevelContext } from "../hooks/LevelsContext";

export const LevelCreateScreen: FC<ScreenProps> = ({ changeScreen }) => {
  const { user } = useAuthContext();
  const {
    editingLevel,
    setEditingLevel,
    modifyLevel,
    saveLevelToDb,
    createLevel,
    fetchOwnLevels,
    deleteLevel,
    ownedLevels,
  } = useLevelContext();

  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<PartialLevelInfo>();
  const [makingNew, setMakingNew] = useState<string>();

  if (!user) throw new Error("User must be authenticated");

  useEffect(() => {
    fetchOwnLevels();
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
                      saveLevelToDb().then(() => setEditingLevel(null))
                    }
                  >
                    Save
                  </Button>
                </Stack>
              </Stack>
            );
          }
          if (!ownedLevels) {
            return (
              <CircularProgress sx={{ width: "100%", alignSelf: "center" }} />
            );
          }
          return (
            <>
              <Stack gap="1rem">
                {ownedLevels.map((level) => (
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
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => {
                              setEditingLevel(level);
                              changeScreen("home");
                            }}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  </Card>
                ))}
              </Stack>
              {ownedLevels.length > 0 && <Divider>or</Divider>}

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
            onClick={() =>
              deleteLevel(deleting?._id ?? "").then(() => {
                setDeleting(undefined);
              })
            }
          >
            Delete
          </Button>
        </ModalDialog>
      </Modal>
      <Modal
        open={makingNew !== undefined}
        onClose={() => setMakingNew(undefined)}
      >
        <ModalDialog>
          <DialogTitle>New Level</DialogTitle>
          <DialogContent>Choose a name for your new level</DialogContent>
          <Input
            value={makingNew}
            onChange={(e) => setMakingNew(e.target.value)}
            placeholder="My level"
          />
          <Button
            disabled={!makingNew}
            sx={{ alignSelf: "flex-end" }}
            onClick={() => {
              setCreating(true);
              createLevel(makingNew ?? "").then(() => {
                setCreating(false);
                changeScreen("home");
              });
            }}
          >
            Create
          </Button>
        </ModalDialog>
      </Modal>
    </>
  );
};
