import {FC, useEffect, useState} from "react"
import {useAuthContext} from "../../hooks/useAuth"
import {useNavigate, useParams} from "react-router-dom"
import {MScreen} from "../Layout"
import {abortGame} from "../../game/editor/eventListeners"
import {LevelMap} from "../../api/serverModels"
import {gameLoopEdit} from "../../game/editor/gameLoopEdit"
import {useLevelContext} from "../../hooks/useLevels"
import {
  Button,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography
} from "@mui/joy"
import {usePauseModalContext} from "../../hooks/PauseModalContext"
import {CourseBuilderSettings} from "../GameEdit/CourseBuilderSettings"
import {Undo, Redo, PlayArrow, Sync, CheckCircle} from "@mui/icons-material"
import {setGlobalEditing} from "../../game/editor/editHelpers"
import {enterGameLoopPreview} from "../../game/previewer/previewLoop"
import {BackButton} from "../ViewHeader"

export const EditScreen = () => {
  const {id} = useParams<{id: string}>()

  const {updateLevelMap} = useLevelContext()
  const {setModal} = usePauseModalContext()

  const {api} = useAuthContext()

  const [fullLevel, setFullLevel] = useState<LevelMap>()

  useEffect(() => {
    if (id) {
      api.level.levelMapDetail(id).then(setFullLevel)
    }
  }, [])

  useEffect(() => {
    if (fullLevel) {
      gameLoopEdit({
        level: fullLevel,
        modifyLevel: (level: Partial<LevelMap>) => {
          updateLevelMap(level)
        }
      })
    }

    return () => {
      abortGame()
    }
  }, [fullLevel])

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center"
      }}
    >
      <div style={{flex: 1}}>
        <MScreen>
          <EditHeader />
          <canvas style={{borderRadius: "10px"}} id="canvas"></canvas>
        </MScreen>
      </div>
      <div style={{flex: 0.5, marginTop: "13rem"}}>
        <Stack justifyContent="flex-start" width="300px">
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
      </div>
    </div>
  )
}

export const EditHeader: FC = () => {
  const {editingLevel, isDirty, saveIfDirty} = useLevelContext()
  const {api} = useAuthContext()
  const navigate = useNavigate()

  if (editingLevel === "loading") {
    return <Skeleton height="40px" variant="rectangular" />
  }

  return (
    <Stack direction="row" gap="1rem" alignItems={"center"}>
      <BackButton />

      <Typography
        sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}
        level="h1"
      >
        Editing {editingLevel?.name}
      </Typography>

      <div style={{flex: 1}}></div>
      <Stack direction="row" sx={{alignSelf: "start"}}>
        <Tooltip title="Undo">
          <IconButton onClick={() => setGlobalEditing("action", "undo")}>
            <Undo />
          </IconButton>
        </Tooltip>
        <Tooltip title="Redo">
          <IconButton onClick={() => setGlobalEditing("action", "redo")}>
            <Redo />
          </IconButton>
        </Tooltip>
      </Stack>
      <Stack direction="row" gap="5px" alignItems={"start"}>
        <Button
          sx={{width: "8rem"}}
          variant="outlined"
          endDecorator={<PlayArrow />}
          onClick={() => {
            if (!editingLevel) return
            abortGame()
            saveIfDirty().then(() => {
              navigate("/test")

              setTimeout(() => {
                // To ensure that the game loop was ended
                api.level
                  .levelMapDetail(editingLevel._id)
                  .then(enterGameLoopPreview)
              }, 100)
            })
          }}
        >
          Preview
        </Button>
        <Stack>
          <Button
            sx={{width: "8rem"}}
            disabled={!isDirty}
            onClick={saveIfDirty}
          >
            Save
          </Button>
          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              m: "2px",
              gap: "5px",
              justifyContent: "flex-end"
            }}
          >
            {isDirty ? (
              <>
                <Typography level="body-sm" variant="plain" sx={{opacity: 0.3}}>
                  Saving...
                </Typography>
                <Sync sx={{opacity: 0.3}} />
              </>
            ) : (
              <>
                <Typography level="body-sm" variant="plain" sx={{opacity: 0.3}}>
                  Saved
                </Typography>
                <CheckCircle sx={{opacity: 0.3}} />
              </>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}
