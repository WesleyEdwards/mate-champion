import {Button, Stack} from "@mui/joy"
import {FC} from "react"
import {usePauseModalContext} from "../hooks/PauseModalContext"
import {CourseBuilderSettings} from "./GameEdit/CourseBuilderSettings"
import {useLevelContext} from "../hooks/useLevels"
import {useNavigator} from "../hooks/UseNavigator"
import {useAuthContext} from "../hooks/useAuth"

export const LevelCreator: FC = () => {
  const {setModal} = usePauseModalContext()
  const {editingLevel} = useLevelContext()
  const {currentScreen} = useNavigator()
  const {user} = useAuthContext()

  if (currentScreen !== "test" && currentScreen !== "edit") {
    return null
  }
  if (editingLevel === "loading") return null

  if (editingLevel && editingLevel.owner !== user?._id) {
    return null
  }

  return (
    <Stack justifyContent="flex-start" height="748px" width="300px">
      <Button
        color="neutral"
        variant="outlined"
        sx={{mb: "1rem", mt: "2rem"}}
        onClick={(e) => {
          if (
            "pointerType" in e.nativeEvent &&
            e.nativeEvent["pointerType"] === "mouse"
          ) {
            setModal("help")
          }
        }}
        endDecorator="?"
      >
        Help
      </Button>
      <CourseBuilderSettings />
    </Stack>
  )
}
