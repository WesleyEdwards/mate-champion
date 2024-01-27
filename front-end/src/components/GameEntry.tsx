import { Button, Stack, Typography } from "@mui/joy";
import { FC, useMemo, useState } from "react";
import Instructions from "./Instructions";
import { PlayStats } from "../Game/helpers/types";
import { emptyStats } from "../Game/helpers/utils";
import HighScores from "./HighScores";
import Settings from "./Settings";
import StatsDiv from "./StatsDiv";
import Controls from "./Controls";
import { PersonalHigh } from "./PersonalHigh";
import { Profile } from "./Profile";
import { Login } from "./Login";
import { CreateAccount } from "./CreateAccount";
import { PersonalHighScore } from "./PersonalHighScore";
import { PlayScreen } from "./PlayScreen";

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
  const [stats, setStats] = useState<PlayStats>(emptyStats);

  const [screen, setScreen] = useState<MCScreen>("home");

  const playing = useMemo(() => screen === "game", [screen]);

  const modifyStats = (newStats: Partial<PlayStats>) =>
    setStats((prev) => ({ ...prev, ...newStats }));

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
    <Stack
      sx={{ px: "1rem", pt: "1rem" }}
      alignItems="center"
      justifyContent="center"
    >
      <Stack width="100%" gap="1rem" alignItems="center">
        {screen === "home" && (
          <>
            <Typography level="h1">Mate Champion</Typography>
            <Instructions />
          </>
        )}
        <PlayScreen
          modifyStats={modifyStats}
          screen={screen}
          setScreen={setScreen}
        />
        <Stack direction="row" width="100%" justifyContent="center" gap="1rem">
          {screen === "home" && (
            <>
              <Button
                hidden={true}
                variant="outlined"
                sx={{ width: "10rem", height: "0px" }}
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
            </>
          )}
        </Stack>
      </Stack>

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
