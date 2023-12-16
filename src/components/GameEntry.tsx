import { Button, Stack, Typography } from "@mui/joy";
import { FC, useState } from "react";
import { useScoreData } from "../hooks/useScoreInfo";
import Instructions from "./Instructions";
import { PlayStats } from "../Game/helpers/types";
import { emptyStats } from "../Game/helpers/utils";
import { enterGameLoop } from "../Game/Main";
import HighScores from "./HighScores";
import Settings from "./Settings";
import StatsDiv from "./StatsDiv";
import Controls from "./Controls";

type Screen =
  | "game"
  | "home"
  | "highScores"
  | "newHighScore"
  | "controls"
  | "settings";

export const GameEntry: FC = () => {
  const { scores, playerScore } = useScoreData();
  const [screen, setScreen] = useState<Screen>("home");

  const [stats, setStats] = useState<PlayStats>({ ...emptyStats });

  const modifyStats = (newStats: Partial<PlayStats>) => {
    setStats((prev) => ({ ...prev, ...newStats }));
  };

  const handleLose = () => setScreen("highScores");

  const playing = screen === "game";

  const handleClickPlay = () => {
    setStats({ ...emptyStats });
    setScreen("game");
    enterGameLoop({ modifyStats, handleLose });
  };

  return (
    <Stack padding="1rem" alignItems="center" justifyContent="center">
      {screen === "home" && (
        <Stack width="100%" gap="1rem" alignItems="center">
          <Typography level="h1">Mate Champion</Typography>
          <Instructions />
          <Button onClick={() => handleClickPlay()}>Play Game</Button>
          <Stack
            direction="row"
            width="100%"
            justifyContent="center"
            gap="1rem"
          >
            <Button
              sx={{ width: "10rem" }}
              onClick={() => setScreen("highScores")}
            >
              High Scores
            </Button>
            <Button
              sx={{ width: "10rem" }}
              onClick={() => setScreen("controls")}
            >
              Controls
            </Button>
          </Stack>
        </Stack>
      )}

      {screen === "highScores" && (
        <HighScores
          score={stats.score}
          scores={scores}
          playerPrevScore={playerScore}
          mainMenu={() => {
            setStats({ ...emptyStats });
            setScreen("home");
          }}
        />
      )}
      {screen === "controls" && <Controls mainMenu={() => setScreen("home")} />}
      {screen === "settings" && <Settings mainMenu={() => setScreen("home")} />}

      <Stack>
        <canvas
          style={{ height: playing ? undefined : "0px", borderRadius: "10px" }}
          id="canvas"
        ></canvas>

        {playing && <StatsDiv stats={stats} />}
      </Stack>
    </Stack>
  );
};