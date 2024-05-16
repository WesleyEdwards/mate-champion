import { Button, Stack, Typography } from "@mui/joy";
import { FC, useMemo, useState } from "react";
import Instructions from "./Instructions";
import { PlayStats } from "../Game/helpers/types";
import { emptyStats } from "../Game/helpers/utils";
import HighScores from "./HighScores";
import Settings from "./Settings";
import StatsDiv from "./StatsDiv";
import Controls from "./Controls";
import { Profile } from "./Profile";
import { Login } from "./Login";
import { CreateAccount } from "./CreateAccount";
import { PersonalHighScore } from "./PersonalHighScore";
import { EditLevelHome } from "./EditLevelHome";
import { EditLevelDetail } from "./EditLevelDetail";
import { PublicLevelsScreen } from "./PublicLevelsScreen";
import { HomeScreen } from "./HomeScreen";
import {
  EditLevelDetailHeader,
  PlayingHeader,
  ViewHeaderSubScreen,
} from "./ViewHeader";

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
  | "editorDetail"
  | "publicLevels";

export interface ScreenProps {
  changeScreen: (screen: MCScreen) => void;
  score: number;
  modifyStats: (newStats: Partial<PlayStats>) => void;
}

export const GameEntry: FC<{
  screen: MCScreen;
  changeScreen: (screen: MCScreen) => void;
}> = ({ screen, changeScreen }) => {
  const [stats, setStats] = useState<PlayStats>(emptyStats);

  const playing = useMemo(() => screen === "game", [screen]);

  const modifyStats = (newStats: Partial<PlayStats>) =>
    setStats((prev) => ({ ...prev, ...newStats }));

  const ScreenViewHeader: JSX.Element = useMemo(() => {
    return (
      {
        game: <PlayingHeader changeScreen={changeScreen} />,
        home: <></>,
        publicLevels: (
          <ViewHeaderSubScreen
            title="Public Levels"
            changeScreen={changeScreen}
          />
        ),
        highScores: (
          <ViewHeaderSubScreen
            title="High Scores"
            changeScreen={changeScreen}
          />
        ),
        personalHigh: (
          <ViewHeaderSubScreen
            title="Personal High"
            changeScreen={changeScreen}
          />
        ),
        controls: (
          <ViewHeaderSubScreen title="Controls" changeScreen={changeScreen} />
        ),
        login: (
          <ViewHeaderSubScreen title="Login" changeScreen={changeScreen} />
        ),
        createAccount: (
          <ViewHeaderSubScreen
            title="Create Account"
            changeScreen={changeScreen}
          />
        ),
        profile: (
          <ViewHeaderSubScreen title="Profile" changeScreen={changeScreen} />
        ),
        settings: (
          <ViewHeaderSubScreen title="Settings" changeScreen={changeScreen} />
        ),
        levelEditor: (
          <ViewHeaderSubScreen
            title="Level Editor"
            changeScreen={changeScreen}
          />
        ),
        editorDetail: <EditLevelDetailHeader changeScreen={changeScreen} />,
      } satisfies Record<MCScreen, JSX.Element>
    )[screen];
  }, [screen]);

  const RenderScreen: FC<ScreenProps> = useMemo(
    () =>
      ((
        {
          game: () => null,
          home: HomeScreen,
          publicLevels: PublicLevelsScreen,
          highScores: HighScores,
          personalHigh: PersonalHighScore,
          controls: Controls,
          login: Login,
          createAccount: CreateAccount,
          profile: Profile,
          settings: Settings,
          levelEditor: EditLevelHome,
          editorDetail: EditLevelDetail,
        } satisfies Record<MCScreen, FC<ScreenProps>>
      )[screen]),
    [screen]
  );

  return (
    <Stack sx={{ px: "1rem", pt: "1rem" }}>
      <Stack
        minWidth="24rem"
        mb={2}
        maxHeight={"calc(100vh - 300px)"}
        sx={{ overflowY: "auto" }}
      >
        {ScreenViewHeader}
        <RenderScreen
          changeScreen={changeScreen}
          score={stats.score}
          modifyStats={modifyStats}
        />
      </Stack>

      <Stack>
        {playing && <div>Level Author: {stats.levelCreator}</div>}
        <canvas
          style={{ height: playing ? undefined : "0px", borderRadius: "10px" }}
          id="canvas"
        ></canvas>

        {playing && <StatsDiv stats={stats} />}
      </Stack>
    </Stack>
  );
};
