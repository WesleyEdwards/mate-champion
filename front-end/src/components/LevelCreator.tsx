import {Button, Stack} from "@mui/joy"
import {FC, useMemo} from "react"
import {usePauseModalContext} from "../hooks/PauseModalContext"
import {CourseBuilderSettings} from "./GameEdit/CourseBuilderSettings"
import {useLevelContext} from "../hooks/useLevels"
import {useAuthContext} from "../hooks/useAuth"
import {useLocation} from "react-router-dom"

export const LevelCreator: FC = () => {
  const {setModal} = usePauseModalContext()
  const {editingLevel} = useLevelContext()
  const {user} = useAuthContext()
  // const location = useLocation()

  const isEditing = useMemo(() => {
    console.log("Calculating", location.pathname)
    if (editingLevel === "loading") {
      console.log("a")
      return false
    }
    if (!editingLevel) {
      console.log("b")
      return false
    }
    if (user && user._id !== editingLevel.owner) {
      console.log("c")
      return false
    }
    return (
      location.pathname.includes("test") || location.pathname.includes("edit")
    )
  }, [location.pathname, editingLevel, user])

  if (!isEditing) {
    return null
  }

  return (
    <Stack justifyContent="flex-start" height="900px" width="300px">
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
