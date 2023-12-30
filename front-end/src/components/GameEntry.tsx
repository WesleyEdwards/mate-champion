import { Button, Stack, Typography } from "@mui/joy";
import { FC, useMemo, useState } from "react";
import Instructions from "./Instructions";
import { PlayStats } from "../Game/helpers/types";
import { emptyStats } from "../Game/helpers/utils";
import { enterGameLoop } from "../Game/Main";
import HighScores from "./HighScores";
import Settings from "./Settings";
import StatsDiv from "./StatsDiv";
import Controls from "./Controls";
import { PersonalHigh } from "./PersonalHigh";
import { Profile } from "./Profile";
import { Login } from "./Login";
import { CreateAccount } from "./CreateAccount";
import { localStorageManager } from "../api/localStorageManager";
import { PersonalHighScore } from "./PersonalHighScore";
import { useAuthContext } from "../hooks/AuthContext";

export type MCScreen =
  | "game"
  | "home"
  | "highScores"
  | "personalHigh"
  | "controls"
  | "login"
  | "createAccount"
  | "profile"
  | "settings";

export interface ScreenProps {
  changeScreen: (screen: MCScreen) => void;
  score?: number;
}

export const GameEntry: FC = () => {
  const { user, api, modifyUser } = useAuthContext();

  const [stats, setStats] = useState<PlayStats>(emptyStats);

  const modifyStats = (newStats: Partial<PlayStats>) =>
    setStats((prev) => ({ ...prev, ...newStats }));

  const [screen, setScreen] = useState<MCScreen>("home");

  const handleLose = (score: number) => {
    const personalHigh =
      user?.highScore ?? parseInt(localStorageManager.get("high-score") ?? "0");
    const isPersonalHigh = score > personalHigh;
    if (isPersonalHigh) {
      localStorageManager.set("high-score", score.toString());
      if (user) {
        api.score.create({
          _id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          score: score,
          userId: user._id,
        });
        modifyUser({ highScore: score });
        modifyStats({ score });
      }
      return setScreen("personalHigh");
    }
    return setScreen("highScores");
  };

  const playing = useMemo(() => screen === "game", [screen]);

  const handleClickPlay = () => {
    setStats({ ...emptyStats });
    setScreen("game");
    enterGameLoop({ modifyStats, handleLose });
  };

  const RenderScreen: FC<ScreenProps> = useMemo(
    () =>
      ((
        {
          game: () => null,
          home: () => null,
          highScores: HighScores,
          personalHigh: PersonalHighScore,
          controls: Controls,
          login: Login,
          createAccount: CreateAccount,
          profile: Profile,
          settings: Settings,
        } satisfies Record<MCScreen, FC<ScreenProps>>
      )[screen]),
    [screen]
  );

  return (
    <Stack padding="1rem" alignItems="center" justifyContent="center">
      {screen === "home" && (
        <Stack width="100%" gap="1rem" alignItems="center">
          <Typography level="h1">Mate Champion</Typography>
          <Instructions />
          <Button
            sx={{ width: "10rem", my: "2rem" }}
            size="lg"
            onClick={handleClickPlay}
          >
            Play Game
          </Button>
          <Stack
            direction="row"
            width="100%"
            justifyContent="center"
            gap="1rem"
          >
            <Button
              variant="outlined"
              sx={{ width: "10rem" }}
              onClick={() => setScreen("highScores")}
            >
              High Scores
            </Button>
            <Button
              variant="outlined"
              sx={{ width: "10rem" }}
              onClick={() => setScreen("controls")}
            >
              Controls
            </Button>
            <Button
              variant="outlined"
              sx={{ width: "10rem" }}
              onClick={() => setScreen("profile")}
            >
              Profile
            </Button>
          </Stack>
        </Stack>
      )}

      <Stack minWidth="24rem">
        <RenderScreen changeScreen={setScreen} score={stats.score} />
      </Stack>

      <Stack>
        <canvas
          style={{ height: playing ? undefined : "0px", borderRadius: "10px" }}
          id="canvas"
        ></canvas>

        {playing && <StatsDiv stats={stats} />}
        {!playing && screen === "home" && <PersonalHigh />}
      </Stack>
    </Stack>
  );
};
