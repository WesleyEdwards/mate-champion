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
    setEditingLevel,
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
              <Button
                onClick={() => changeScreen("publicLevels")}
                sx={{ width: "12rem", alignSelf: "center" }}
                variant="outlined"
              >
                See what others have made
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
