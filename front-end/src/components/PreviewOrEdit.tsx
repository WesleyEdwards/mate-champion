import {Button, Stack} from "@mui/joy"
import {FC} from "react"
import {ScreenProps} from "./GameEntry"
import {emptyStats} from "../game/loopShared/utils"
import {Construction, PlayArrow} from "@mui/icons-material"
import {LevelMap} from "../game/loopShared/models"
import {useLevelContext} from "../hooks/useLevels"
import {useNavigator} from "../hooks/UseNavigator"
import {gameLoopEdit} from "../game/editor/gameLoopEdit"
import {enterGameLoopPreview} from "../game/previewer/previewLoop"
import {useAuthContext} from "../hooks/useAuth"
import {getLevelDiff} from "../helpers"

export const PreviewOrEdit: FC<ScreenProps> = ({modifyStats}) => {
  const {api} = useAuthContext()
  const {editingLevel, setGameMode, setIsDirty, updateLevelMap} =
    useLevelContext()
  const {navigateTo} = useNavigator()

  return (
    <Stack gap="1rem" direction="row">
      <Button
        size="lg"
        fullWidth
        variant="outlined"
        endDecorator={<Construction />}
        onClick={() => {
          modifyStats({...emptyStats})
          navigateTo("game")
          window.stopLoop = false

          setGameMode("edit")

          if (editingLevel === null || editingLevel === "loading") {
            return console.error("Invalid state")
          }

          api.level.levelMapDetail(editingLevel._id).then((level) => {
            gameLoopEdit({
              level,
              setIsDirty: () => setIsDirty(true),
              modifyLevel: (level: Partial<LevelMap>) => {
                updateLevelMap(level)
                setIsDirty(false)
              }
            })
          })
        }}
      >
        Edit
      </Button>
      <Button
        size="lg"
        variant="outlined"
        endDecorator={<PlayArrow />}
        fullWidth
        onClick={() => {
          modifyStats({...emptyStats})
          navigateTo("game")
          window.stopLoop = false

          setGameMode("test")
          if (editingLevel === null || editingLevel === "loading") {
            console.error("Invalid state")
            return
          }
          api.level.levelMapDetail(editingLevel._id).then(enterGameLoopPreview)
        }}
      >
        Preview
      </Button>
    </Stack>
  )
}
