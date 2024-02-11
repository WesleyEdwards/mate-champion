import { FC } from "react";
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
} from "@mui/joy";
import { Add } from "@mui/icons-material";
import { useAuthContext } from "../hooks/AuthContext";
import { localStorageManager } from "../api/localStorageManager";

export const LevelCreateScreen: FC<ScreenProps> = ({ changeScreen }) => {
  const {
    setLevelCreating: setCreatingLevel,
    creatingLevel,
    modifyLevel,
    saveLevelToDb,
    deleteFromDatabase,
  } = useAuthContext();

  const ownedLevels = localStorageManager.getLevels();

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
                  setCreatingLevel({
                    _id: crypto.randomUUID(),
                    name: "My level",
                    opponents: { grog: [] },
                    packages: [],
                    floors: [{ x: -500, width: 2070, color: "green" }],
                    platforms: [],
                  });
                }}
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
