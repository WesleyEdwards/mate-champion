import { FC, useEffect, useState } from "react";
import { useAuthContext } from "../hooks/AuthContext";
import { MCScreen, ScreenProps } from "./GameEntry";
import { PartialLevelInfo } from "../Game/models";
import {
  Card,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/joy";
import { PlayArrow } from "@mui/icons-material";
import { emptyStats } from "../Game/helpers/utils";
import { enterGameLoop } from "../Game/Main";
import { usePauseModalContext } from "../hooks/PauseModalContext";
import { useLevelContext } from "../hooks/useLevels";

export const PublicLevelsScreen: FC<ScreenProps> = ({
  modifyStats,
  changeScreen,
}) => {
  const { api } = useAuthContext();
  const { setGameMode } = useLevelContext();
  const { setModal } = usePauseModalContext();

  const [levels, setLevels] = useState<PartialLevelInfo[]>([]);

  const handleEnterGamePlay = async (levelId: string) => {
    const level = await api.level.detail(levelId);
    changeScreen("game");
    modifyStats({ ...emptyStats });

    setGameMode("test");

    enterGameLoop({
      setUI: {
        modifyStats,
        handleLose: () => {},
        handlePause: (pause: boolean) => {
          return setModal(pause ? "pause" : null);
        },
      },
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
    <Stack
      maxHeight="calc(100vh - 8rem)"
      sx={{
        overflowY: "auto",
        width: "calc(100vw - 8rem)",
      }}
    >
      {levels.length === 0 && (
        <CircularProgress sx={{ width: "100%", alignSelf: "center" }} />
      )}
      <Stack
        direction="row"
        gap="1rem"
        sx={{
          flexWrap: "wrap",
          justifyContent: "center"
        }}
      >
        {levels.map((level) => (
          <LevelCard
            level={level}
            key={level._id}
            subtitle={level.creatorName}
            actionButton={
              <IconButton
                onClick={() => {
                  handleEnterGamePlay(level._id);
                }}
                color="success"
              >
                <PlayArrow />
              </IconButton>
            }
          />
        ))}
      </Stack>
    </Stack>
  );
};

export const LevelCard: FC<{
  level: PartialLevelInfo;
  subtitle?: string;
  actionButton: React.ReactNode;
}> = ({ level, actionButton, subtitle }) => {
  return (
    <Card key={level._id} sx={{ padding: "10px", width: "24rem" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack>
          <Typography level="h4">{level.name}</Typography>
          {subtitle && <Typography level="body-sm">{subtitle}</Typography>}
        </Stack>
        {actionButton}
      </Stack>
    </Card>
  );
};

// {ownedLevels.map((level) => (
//   <LevelCard
//     level={level}
//     key={level._id}
//     actionButton={
//       <IconButton
//         onClick={() => {
//           setEditingLevel(level);
//           changeScreen("editorDetail");
//         }}
//       >
//         <Edit />
//       </IconButton>
//     }
//   />
// ))}