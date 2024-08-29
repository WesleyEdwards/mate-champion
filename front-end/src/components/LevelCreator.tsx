import {Button, Stack, Switch, Typography} from "@mui/joy"
import {FC} from "react"
import {usePauseModalContext} from "../hooks/PauseModalContext"
import {useLevelContext} from "../hooks/useLevels"
import {CourseBuilderSettings} from "./GameEdit/CourseBuilderSettings"

export const LevelCreator: FC = () => {
  const {gameMode} = useLevelContext()

  const {setModal} = usePauseModalContext()

  if (gameMode !== "edit") {
    return null
  }

  return (
    <Stack m={2} justifyContent="flex-start" height="748px" width="300px">
      <CourseBuilderSettings />
      <Button
        color="neutral"
        variant="plain"
        sx={{marginTop: "auto"}}
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
    </Stack>
  )
}
