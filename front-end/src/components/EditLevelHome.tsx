import { FC, useEffect, useState } from "react";
import { ScreenProps } from "./GameEntry";
import {
  Button,
  Divider,
  Stack,
  Typography,
  CircularProgress,
  Card,
  Tooltip,
} from "@mui/joy";
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
      <Stack gap={4} width={"100%"}>
        {(() => {
          if (!ownedLevels) {
            return (
              <CircularProgress sx={{ width: "100%", alignSelf: "center" }} />
            );
          }
          return (
            <>
              <Stack
                gap="1rem"
                flexGrow={1}
                maxHeight={"500px"}
                sx={{
                  width: "100%",
                  overflowY: "auto",
                }}
              >
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
                      <div style={{ flexGrow: 1 }}></div>
                      <Stack direction="row" gap="1rem">
                        <DeleteLevel name={level.name} id={level._id} />
                      </Stack>
                    </Stack>
                  </Card>
                ))}
              </Stack>
              {ownedLevels.length > 0 && <Divider>or</Divider>}

              <CreateNewLevel onCreate={() => changeScreen("editorDetail")} />
              <Tooltip title="See what levels other people have made">
                <Button
                  onClick={() => changeScreen("publicLevels")}
                  sx={{ alignSelf: "center" }}
                  variant="plain"
                >
                  Public Levels
                </Button>
              </Tooltip>
            </>
          );
        })()}
      </Stack>
    </>
  );
};
