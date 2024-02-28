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
import { camelCaseToTitleCase } from "../helpers";
import { useAuthContext } from "../hooks/AuthContext";
import { LevelCreateScreen } from "./LevelCreateScreen";
import { useLevelContext } from "../hooks/LevelsContext";
import { EditLevelButtons } from "./EditLevelButtons";
import { PublicLevelsScreen } from "./PublicLevelsScreen";

export type MCScreen =
  | "game"
  | "home"
  | "highScores"
  | "personalHigh"
  | "controls"
  | "login"
  | "createAccount"
  | "profile"
  | "settings"
  | "levelEditor"
  | "publicLevels";

export interface ScreenProps {
  changeScreen: (screen: MCScreen) => void;
  score?: number;
}

export const GameEntry: FC<{
  screen: MCScreen;
  changeScreen: (screen: MCScreen) => void;
}> = ({ screen, changeScreen }) => {
  const { user } = useAuthContext();
  const { editingLevel } = useLevelContext();
  const [stats, setStats] = useState<PlayStats>(emptyStats);

  const playing = useMemo(() => screen === "game", [screen]);

  const modifyStats = (newStats: Partial<PlayStats>) =>
    setStats((prev) => ({ ...prev, ...newStats }));

  const RenderScreen: FC<ScreenProps> = useMemo(
    () =>
      ((
        {
          game: () => null,
          home: () => null,
          publicLevels: () => null,
          highScores: HighScores,
          personalHigh: PersonalHighScore,
          controls: Controls,
          login: Login,
          createAccount: CreateAccount,
          profile: Profile,
          settings: Settings,
          levelEditor: LevelCreateScreen,
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
        {screen === "home" && !editingLevel && (
          <>
            <Typography level="h1">Mate Champion</Typography>
            <Instructions />
          </>
        )}
        {editingLevel ? (
          <EditLevelButtons
            modifyStats={modifyStats}
            screen={screen}
            setScreen={changeScreen}
          />
        ) : (
          <PlayScreen
            modifyStats={modifyStats}
            screen={screen}
            setScreen={changeScreen}
          />
        )}
        {screen === "publicLevels" && (
          <PublicLevelsScreen
            setScreen={changeScreen}
            modifyStats={modifyStats}
          />
        )}
        {screen === "home" && (
          <Stack
            direction="row"
            width="100%"
            justifyContent="center"
            gap="1rem"
            mb={4}
          >
            {Object.entries({
              highScores: !editingLevel,
              controls: !editingLevel,
              profile: !editingLevel,
              levelEditor:
                !editingLevel &&
                (user?.userType === "Editor" || user?.userType === "Admin"),
            } satisfies Partial<Record<MCScreen, boolean>>).map(
              ([view, show]) =>
                show ? (
                  <Button
                    key={view}
                    variant="outlined"
                    sx={{ width: "10rem" }}
                    onClick={() => changeScreen(view as MCScreen)}
                  >
                    {camelCaseToTitleCase(view)}
                  </Button>
                ) : null
            )}
          </Stack>
        )}
      </Stack>

      <Stack minWidth="24rem" mb={2}>
        <RenderScreen changeScreen={changeScreen} score={stats.score} />
      </Stack>

      <Stack>
        {playing && <div>Level Author: {stats.levelCreator}</div>}
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
