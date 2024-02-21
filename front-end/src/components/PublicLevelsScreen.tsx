import { FC, useEffect, useState } from "react";
import { useAuthContext } from "../hooks/AuthContext";
import { MCScreen, ScreenProps } from "./GameEntry";
import { ViewHeader } from "./ViewHeader";
import { PartialLevelInfo } from "../Game/models";
import {
  Card,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/joy";
import { PlayArrow } from "@mui/icons-material";
import { useLevelContext } from "../hooks/LevelsContext";
import { PlayStats } from "../Game/helpers/types";
import { emptyStats } from "../Game/helpers/utils";
import { enterGameLoop } from "../Game/Main";

export const PublicLevelsScreen: FC<{
  modifyStats: (newStats: Partial<PlayStats>) => void;
  setScreen: (screen: MCScreen) => void;
}> = ({ modifyStats, setScreen }) => {
  const { api } = useAuthContext();
  const { setGameMode } = useLevelContext();

  const [levels, setLevels] = useState<PartialLevelInfo[]>([]);

  const handleEnterGamePlay = async (levelId: string) => {
    const level = await api.level.detail(levelId);
    modifyStats({ ...emptyStats });

    setGameMode("test");

    enterGameLoop({
      setUI: { modifyStats, handleLose: () => {}, handlePause: () => {} },
      gameMode: "test",
      levels: [level],
      setLevel: () => {},
    });
  };
  useEffect(() => {
    api.level
      .queryPartial({ public: true }, ["_id", "name", "owner", "creatorName"])
      .then((res) => setLevels(res as PartialLevelInfo[]));
  }, []);

  return (
    <>
      <ViewHeader changeScreen={setScreen} title="Public Levels" />
      {levels.length === 0 && (
        <CircularProgress sx={{ width: "100%", alignSelf: "center" }} />
      )}
      {levels.map((level) => (
        <Card key={level._id} sx={{ padding: "5px", width: "24rem" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack>
              <Typography level="h4">{level.name}</Typography>
              <Typography level="body-sm">{level.creatorName}</Typography>
            </Stack>
            <IconButton
              onClick={() => {
                handleEnterGamePlay(level._id);
                setScreen("game");
              }}
              color="success"
            >
              <PlayArrow />
            </IconButton>
          </Stack>
        </Card>
      ))}
    </>
  );
};
