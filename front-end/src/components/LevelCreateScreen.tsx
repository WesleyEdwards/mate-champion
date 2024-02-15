import { FC, useEffect, useState } from "react";
import { ScreenProps } from "./GameEntry";
import { ViewHeader } from "./ViewHeader";
import {
  Option,
  Button,
  Divider,
  Input,
  Select,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/joy";
import { Add } from "@mui/icons-material";
import { useAuthContext } from "../hooks/AuthContext";
import { localStorageManager } from "../api/localStorageManager";
import { LevelInfo } from "../Game/models";

export const LevelCreateScreen: FC<ScreenProps> = ({ changeScreen }) => {
  const {
    setLevelCreating: setCreatingLevel,
    creatingLevel,
    modifyLevel,
    saveLevelToDb,
    api,
    deleteFromDatabase,
    user,
  } = useAuthContext();

  const [ownedLevels, setOwnedLevels] = useState<LevelInfo[]>();
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    setOwnedLevels(undefined);
    api.level.query({ owner: user?._id ?? "" }).then(setOwnedLevels);
  }, []);

  return (
    <>
      <ViewHeader changeScreen={changeScreen} title="Level Creator" />
      <Stack my={4} gap={4}>
        {(() => {
          if (creatingLevel) {
            return (
              <Stack justifyContent="space-between" height="12rem">
                <Stack direction="row" alignItems="center" gap="1rem">
                  <Typography>Editing:</Typography>
                  <Input
                    placeholder="Name"
                    value={creatingLevel.name}
                    onChange={(e) => modifyLevel({ name: e.target.value })}
                  />
                </Stack>
                <Stack
                  direction="row"
                  sx={{ alignSelf: "flex-end" }}
                  gap="1rem"
                >
                  <Button
                    color="danger"
                    onClick={() => {
                      deleteFromDatabase();
                      return setCreatingLevel(null);
                    }}
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={() => {
                      saveLevelToDb();
                      return setCreatingLevel(null);
                    }}
                  >
                    Close
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
              {ownedLevels.length > 0 && (
                <>
                  <Select
                    placeholder="Select level"
                    value={creatingLevel}
                    onChange={(e, value) => {
                      const selected = ownedLevels.find(
                        (l) => l._id === (value as string)
                      );
                      if (selected) {
                        setCreatingLevel(selected);
                      }
                    }}
                  >
                    {ownedLevels.map((level) => (
                      <Option value={level._id} key={level._id}>
                        {level.name}
                      </Option>
                    ))}
                  </Select>
                  <Divider>or</Divider>
                </>
              )}

              <Button
                onClick={() => {
                  setCreating(true);
                  api.level
                    .create({
                      _id: crypto.randomUUID(),
                      owner: user?._id ?? "Anonymouse",
                      public: false,
                      name: "My level",
                      opponents: { grog: [] },
                      packages: [],
                      floors: [{ x: -500, width: 2070, color: "green" }],
                      platforms: [],
                    })
                    .then((created) => {
                      setCreating(false)
                      setOwnedLevels((prev) =>
                        prev ? [...prev, created] : prev
                      );
                      return setCreatingLevel(created);
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
    </>
  );
};
