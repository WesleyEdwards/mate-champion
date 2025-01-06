import {FC, useEffect, useState} from "react"
import {useAuthContext} from "../../hooks/useAuth"
import {useNavigate, useParams} from "react-router-dom"
import {MScreen} from "../Layout"
import {abortGame} from "../../game/editor/eventListeners"
import {LevelInfo, LevelMap} from "../../api/serverModels"
import {gameLoopEdit} from "../../game/editor/gameLoopEdit"
import {useLevels} from "../../hooks/useLevels"
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
import {BackButton} from "../ViewHeader"

export const EditScreen = () => {
  const {id} = useParams<{id: string}>()

  const {setModal} = usePauseModalContext()

  const {api} = useAuthContext()

  const [levelInfo, setLevelInfo] = useState<LevelInfo | null>(null)
  const [level, setLevel] = useState<LevelMap | null>(null)

  const {updateLevelMap, isDirty, saveIfDirty} = useLevels({
    level: levelInfo,
    setLevel: setLevelInfo
  })

  useEffect(() => {
    if (id) {
      api.level.detail(id).then(setLevelInfo)
      api.level.levelMapDetail(id).then(setLevel)
    }
  }, [id])

  useEffect(() => {
    if (level) {
      gameLoopEdit({
        level: level,
        modifyLevel: (level: Partial<LevelMap>) => {
          updateLevelMap(level)
        }
      })
    }

    return () => {
      abortGame()
    }
  }, [level])

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center"
      }}
    >
      <div style={{flex: 1}}>
        <MScreen>
          <EditHeader
            levelInfo={levelInfo ?? undefined}
            isDirty={isDirty}
            saveIfDirty={saveIfDirty}
          />
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

export const EditHeader = ({
  levelInfo,
  isDirty,
  saveIfDirty
}: {
  levelInfo: LevelInfo | undefined
  isDirty: boolean
  saveIfDirty: () => Promise<unknown>
}) => {
  const navigate = useNavigate()

  if (!levelInfo) {
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
        Editing {levelInfo.name}
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
            if (!levelInfo) return
            abortGame()
            saveIfDirty().then(() => {
              navigate(`/levels/${levelInfo._id}/test`, {replace: true})
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
