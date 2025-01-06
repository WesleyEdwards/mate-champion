import {createBrowserRouter, Navigate} from "react-router-dom"
import {HighScores} from "./HighScores"
import {Profile} from "./Profile"
import {Login} from "./Login"
import {CreateAccount} from "./CreateAccount"
import {PersonalHighScore} from "./PersonalHighScore"
import {EditLevelDetail} from "./EditLevelDetail"
import {HomeScreen} from "./HomeScreen"
import {LevelEditorHome} from "./LevelEditorHome"
import {PlayScreen} from "./gameEntry/PlayScreen"
import {PreviewScreen} from "./gameEntry/PreviewScreen"
import {EditScreen} from "./gameEntry/EditScreen"

export const routes = createBrowserRouter([
  {path: "landing", Component: HomeScreen},
  {path: "play", Component: PlayScreen},
  {path: "levels/:id", Component: EditLevelDetail},
  {path: "levels/:id/edit", Component: EditScreen},
  {path: "levels/:id/preview", Component: PreviewScreen},
  {path: "levels", Component: LevelEditorHome},
  {path: "highScores", Component: HighScores},
  {path: "personalHigh", Component: PersonalHighScore},
  {path: "login", Component: Login},
  {path: "profile", Component: Profile},
  {path: "createAccount,", Component: CreateAccount},

  {path: "*", element: <Navigate to="/landing" replace />}
])
