import {Button, Stack, Switch, Typography} from "@mui/joy"
import {FC} from "react"
import {usePauseModalContext} from "../hooks/PauseModalContext"
import {useLevelContext} from "../hooks/useLevels"
import {CourseBuilderSettings} from "./GameEdit/CourseBuilderSettings"

export const LevelCreator: FC = () => {
  const {gameMode} = useLevelContext()

  const {setModal} = usePauseModalContext()

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
