import { FC, useEffect, useState } from "react";
import { MCScreen, ScreenProps } from "./GameEntry";
import { LevelInfo } from "../Game/models";
import {
  Card,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/joy";
import { PlayArrow } from "@mui/icons-material";
import { emptyStats } from "../Game/helpers/utils";
import { enterGameLoop } from "../Game/Main";
import { usePauseModalContext } from "../hooks/PauseModalContext";
import { useLevelContext } from "../hooks/useLevels";
import { GridComponent } from "./LevelEditorHome";
import { useNavigator } from "../hooks/UseNavigator";
import { useAuthContext } from "../hooks/useAuth";

export const PublicLevelsScreen: FC<ScreenProps> = ({ modifyStats }) => {
  const { api } = useAuthContext();
  const { setGameMode } = useLevelContext();
  const { setModal } = usePauseModalContext();
  const { navigateTo } = useNavigator();
  const [levels, setLevels] = useState<LevelInfo[]>();

  const handleEnterGamePlay = async (levelId: string) => {
    const details = await api.level.detail(levelId);
    const map = await api.level.levelMapDetail(levelId);
    navigateTo("game");
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
      levels: [{ ...details, ...map }],
      setLevel: () => {},
    });
  };

  useEffect(() => {
    setLevels(undefined);
    api.level.query({ public: true }).then(setLevels);
  }, []);

  return (
    <>
      <GridComponent
        items={
          levels?.map((level) => (
            <LevelCard
              level={level}
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
          )) ?? "loading"
        }
      />
    </>
  );
};

export const LevelCard: FC<{
  level: LevelInfo;
  subtitle?: string;
  actionButton: React.ReactNode;
}> = ({ level, actionButton, subtitle }) => {
  return (
    <Card
      key={level._id}
      sx={{
        width: "100%",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack sx={{ overflow: "hidden" }}>
          <Typography
            level="h4"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {level.name}
          </Typography>
          {subtitle && <Typography level="body-sm">{subtitle}</Typography>}
        </Stack>
        {actionButton}
      </Stack>
    </Card>
  );
};
