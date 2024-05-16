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
} from "@mui/joy";
import { Add, Create } from "@mui/icons-material";
import { useAuthContext } from "../hooks/AuthContext";
import { DeleteLevel } from "./DeleteLevel";
import { CreateNewLevel } from "./CreateNewLevel";
import { useLevelContext } from "../hooks/useLevels";

export const EditLevelHome: FC<ScreenProps> = ({ changeScreen }) => {
  const { user } = useAuthContext();
  const { setEditingLevel, ownedLevels } = useLevelContext();

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

              <CreateNewLevel onCreate={() => changeScreen("editorDetail")} />
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
    </>
  );
};
