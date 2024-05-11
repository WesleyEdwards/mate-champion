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
import { useLevelContext } from "../hooks/LevelsContext";
import { DeleteLevel } from "./DeleteLevel";

export const EditLevelHome: FC<ScreenProps> = ({ changeScreen }) => {
  const { user } = useAuthContext();
  const { setEditingLevel, createLevel, ownedLevels } = useLevelContext();

  const [creating, setCreating] = useState(false);

  const [makingNew, setMakingNew] = useState<string>();

  if (!user) throw new Error("User must be authenticated");

  return (
    <>
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
                  <Card
                    variant="soft"
                    key={level._id}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        opacity: 0.8,
                      },
                    }}
                  >
                    <Stack
                      onClick={() => {
                        setEditingLevel(level);
                        changeScreen("editorDetail");
                      }}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography level="h4">{level.name}</Typography>
                      <Stack direction="row" gap="1rem">
                        <DeleteLevel name={level.name} id={level._id} />
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
                sx={{ alignSelf: "center" }}
                variant="plain"
              >
                See levels that other people have made
              </Button>
            </>
          );
        })()}
      </Stack>

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
                changeScreen("editorDetail");
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
