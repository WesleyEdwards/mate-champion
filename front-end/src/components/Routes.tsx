import {createBrowserRouter, Navigate} from "react-router-dom"
import {HighScores} from "./HighScores"
import {Profile} from "./Profile"
import {Login} from "./Login"
import {CreateAccount} from "./CreateAccount"
import {EditLevelDetail} from "./EditLevelDetail"
import {HomeScreen} from "./HomeScreen"
import {LevelEditorHome} from "./LevelEditorHome"
import {PlayScreen} from "./gameEntry/PlayScreen"
import {PreviewScreen} from "./gameEntry/PreviewScreen"
import {EditScreen} from "./gameEntry/EditScreen"
import {TestScreen} from "./gameEntry/TestScreen"

export const routes = createBrowserRouter([
  {path: "landing", Component: HomeScreen},
  {path: "play", Component: PlayScreen},
  {path: "levels/:id", Component: EditLevelDetail},
  {path: "levels/:id/edit", Component: EditScreen},
  {path: "levels/:id/test", Component: TestScreen},
  {path: "levels/:id/preview", Component: PreviewScreen},
  {path: "levels", Component: LevelEditorHome},
  {path: "highScores", Component: HighScores},
  {path: "login", Component: Login},
  {path: "profile", Component: Profile},
  {path: "createAccount,", Component: CreateAccount},

  {path: "*", element: <Navigate to="/landing" replace />}
])
