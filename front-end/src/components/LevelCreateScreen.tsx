import { FC } from "react";
import { ScreenProps } from "./GameEntry";
import { ViewHeader } from "./ViewHeader";
import { Button, Divider, Input, Stack, Typography } from "@mui/joy";
import { Add } from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";
import { useAuthContext } from "../hooks/AuthContext";

export const LevelCreateScreen: FC<ScreenProps> = ({ changeScreen }) => {
  const { setCreatingLevel, creatingLevel, modifyLevel } = useAuthContext();

  return (
    <>
      <ViewHeader changeScreen={changeScreen} title="Level Creator" />
      <Stack my={4} gap={4}>
        {(() => {
          if (creatingLevel) {
            return (
              <>
                <Typography>Editing: {creatingLevel.name}</Typography>
                <Input
                  placeholder="Name"
                  value={creatingLevel.name}
                  onChange={(e) => modifyLevel({ name: e.target.value })}
                />
              </>
            );
          }
          return (
            <>
              <Typography>Choose a level to edit.</Typography>
              <Divider>or</Divider>
              <Button
                onClick={() => {
                  setCreatingLevel({
                    _id: crypto.randomUUID(),
                    name: "My level",
                    opponents: { grog: [] },
                    packages: [],
                    floors: [],
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
