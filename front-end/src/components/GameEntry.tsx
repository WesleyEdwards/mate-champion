import {Stack, Typography} from "@mui/joy"
import {FC, useMemo, useState} from "react"
import {emptyStats} from "../game/loopShared/utils"
import HighScores from "./HighScores"
import Settings from "./Settings"
import StatsDiv from "./StatsDiv"
import Controls from "./Controls"
import {Profile} from "./Profile"
import {Login} from "./Login"
import {CreateAccount} from "./CreateAccount"
import {PersonalHighScore} from "./PersonalHighScore"
import {EditLevelDetail} from "./EditLevelDetail"
import {HomeScreen} from "./HomeScreen"
import {
  EditLevelDetailHeader,
  LevelsHeader,
  PlayingHeader,
  ViewHeaderSubScreen
} from "./ViewHeader"
import {LevelEditorHome} from "./LevelEditorHome"
import {useNavigator} from "../hooks/UseNavigator"
import {useLevelContext} from "../hooks/useLevels"
import {PlayStats} from "../game/loopShared/models"

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

export interface ScreenProps {
  score: number
  modifyStats: (newStats: Partial<PlayStats>) => void
}

export const GameEntry: FC = () => {
  const [stats, setStats] = useState<PlayStats>(emptyStats)
  const {currentScreen} = useNavigator()
  const {gameMode} = useLevelContext()

  const playing = useMemo(() => currentScreen === "game", [currentScreen])

  const modifyStats = (newStats: Partial<PlayStats>) =>
    setStats((prev) => ({...prev, ...newStats}))

  const ScreenViewHeader: JSX.Element = useMemo(
    () => getSubViewHeader(currentScreen),
    [currentScreen]
  )

  const RenderScreen: FC<ScreenProps> = useMemo(
    () => getCurrentScreen(currentScreen),
    [currentScreen]
  )

  return (
    <>
      {ScreenViewHeader}
      <Stack mb={2} sx={{minWidth: "546px", maxWidth: "1300px"}}>
        <RenderScreen score={stats.score} modifyStats={modifyStats} />
      </Stack>

      <Stack>
        <canvas
          style={{height: playing ? undefined : "0px", borderRadius: "10px"}}
          id="canvas"
        ></canvas>

        {playing && gameMode === "play" && <StatsDiv stats={stats} />}
      </Stack>
    </>
  )
}

const getCurrentScreen = (screen: MCScreen): FC<ScreenProps> => {
  const map: Record<MCScreen, FC<ScreenProps>> = {
    game: () => null,
    home: HomeScreen,
    levelEditor: LevelEditorHome,
    highScores: HighScores,
    personalHigh: PersonalHighScore,
    controls: Controls,
    login: Login,
    createAccount: CreateAccount,
    profile: Profile,
    settings: Settings,
    editorDetail: EditLevelDetail
  }
  return map[screen]
}

const getSubViewHeader = (screen: MCScreen): JSX.Element => {
  const subHeaders: Record<MCScreen, JSX.Element> = {
    game: <PlayingHeader />,
    home: <></>,
    levelEditor: <LevelsHeader />,
    highScores: <ViewHeaderSubScreen title="High Scores" />,
    personalHigh: <ViewHeaderSubScreen title="Personal High" />,
    controls: <ViewHeaderSubScreen title="Controls" />,
    login: <ViewHeaderSubScreen title="Login" />,
    createAccount: <ViewHeaderSubScreen title="Create Account" />,
    profile: <ViewHeaderSubScreen title="Profile" />,
    settings: <ViewHeaderSubScreen title="Settings" />,
    editorDetail: <EditLevelDetailHeader />
  }
  return subHeaders[screen]
}
