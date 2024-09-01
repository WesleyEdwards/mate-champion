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

export const PreviewOrEdit: FC<ScreenProps> = ({modifyStats}) => {
  const {levelCache, editingLevel, setGameMode, setIsDirty} = useLevelContext()
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

          gameLoopEdit({
            level: editingLevel,
            setIsDirty: () => setIsDirty(true),
            modifyLevel: (level: Partial<LevelMap>) => {
              levelCache.update.modify(editingLevel!._id, level)
              setIsDirty(false)
            }
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
          enterGameLoopPreview(editingLevel)
        }}
      >
        Preview
      </Button>
    </Stack>
  )
}
