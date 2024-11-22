import {
  Button,
  Divider,
  IconButton,
  Input,
  Skeleton,
  Stack,
  Tooltip,
  Typography
} from "@mui/joy"
import {
  ArrowBack,
  Check,
  CheckCircle,
  Construction,
  Edit,
  PlayArrow,
  Redo,
  Sync,
  Undo
} from "@mui/icons-material"
import {FC, useState} from "react"
import {useLevelContext} from "../hooks/useLevels"
import {CreateNewLevel} from "./CreateNewLevel"
import {useNavigator} from "../hooks/UseNavigator"
import {useAuthContext} from "../hooks/useAuth"
import {enterGameLoopPreview} from "../game/previewer/previewLoop"
import {gameLoopEdit} from "../game/editor/gameLoopEdit"
import {LevelMap} from "../game/loopShared/models"
import {abortGame} from "../game/editor/eventListeners"
import {MCScreen} from "./GameEntry"
import {useToast} from "../hooks/Toaster"

const ViewHeaderSubScreen: FC<{
  title: string
}> = ({title}) => {
  const {goBack} = useNavigator()
  return (
    <Stack width="100%" gap="0.75rem" mb="1rem">
      <Stack direction="row" justifyContent="space-between">
        <IconButton onClick={goBack}>
          <ArrowBack />
        </IconButton>
        <Typography level="h2">{title}</Typography>
        <div style={{width: "2rem"}}></div>
      </Stack>
      <Divider />
    </Stack>
  )
}

const LevelsHeader: FC = () => {
  const {goBack} = useNavigator()
  return (
    <Stack width="100%" gap="0.75rem" mb="1rem">
      <Stack direction="row" justifyContent="space-between">
        <IconButton onClick={goBack}>
          <ArrowBack />
        </IconButton>
        <Typography level="h2">Levels</Typography>
        <CreateNewLevel />
      </Stack>
      <Divider />
    </Stack>
  )
}

const EditLevelDetailHeader: FC = () => {
  const {goBack} = useNavigator()
  const [editingName, setEditingName] = useState<string>()
  const {api} = useAuthContext()
  const {editingLevel, updateEditingLevel} = useLevelContext()
  const toast = useToast()

  if (editingLevel === "loading" || editingLevel === null) {
    return <Skeleton height="40px" variant="rectangular" />
  }

  return (
    <Stack width="100%" gap="0.75rem" mb="1rem">
      {editingName === undefined ? (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap="1rem"
          width="100%"
        >
          <IconButton
            onClick={() => {
              goBack()
              abortGame()
            }}
          >
            <ArrowBack />
          </IconButton>

          <Typography
            level="h1"
            maxWidth={"700px"}
            overflow={"hidden"}
            textOverflow={"ellipsis"}
            noWrap={true}
          >
            {editingLevel.name}
          </Typography>
          <Tooltip title="Edit Name">
            <IconButton onClick={() => setEditingName(editingLevel.name)}>
              <Edit />
            </IconButton>
          </Tooltip>
        </Stack>
      ) : (
        <Stack direction="row" alignItems="center" width="100%" gap="1rem">
          <Input
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            sx={{flexGrow: 1, fontSize: "2rem"}}
          />
          <Tooltip title="Undo">
            <IconButton
              variant="plain"
              onClick={() => setEditingName(undefined)}
            >
              <Undo />
            </IconButton>
          </Tooltip>
          <Tooltip title="Save">
            <IconButton
              onClick={() => {
                api.level.modify(editingLevel._id, {name: editingName})
                toast({message: "Name successfully changed"})
                updateEditingLevel({name: editingName})
                setEditingName(undefined)
              }}
            >
              <Check />
            </IconButton>
          </Tooltip>
        </Stack>
      )}
      <div style={{width: "2rem"}}></div>
      <Divider />
    </Stack>
  )
}

const BackButton = () => {
  const {goBack} = useNavigator()
  return (
    <IconButton
      sx={{display: "absolute"}}
      onClick={() => {
        abortGame()
        goBack()
      }}
    >
      <ArrowBack />
    </IconButton>
  )
}

const PlayHeader: FC = () => {
  return (
    <Stack direction={"row"} height="64px" alignItems={"center"}>
      <BackButton />
      <Typography
        sx={{
          marginInline: "auto"
        }}
        level="h1"
      >
        Mate Champion🧉
      </Typography>
    </Stack>
  )
}

const PreviewHeader: FC = () => {
  const {editingLevel} = useLevelContext()

  if (editingLevel === "loading") {
    return <Skeleton height="40px" variant="rectangular" />
  }

  return (
    <Stack direction={"row"} height="64px" alignItems={"center"} gap="1rem">
      <BackButton />
      <Typography
        sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}
        level="h1"
      >
        {editingLevel?.name}
      </Typography>
    </Stack>
  )
}
const TestHeader: FC = () => {
  const {editingLevel, updateLevelMap} = useLevelContext()
  const {api, user} = useAuthContext()
  const {navigateTo} = useNavigator()

  if (editingLevel === "loading") {
    return <Skeleton height="40px" variant="rectangular" />
  }

  return (
    <Stack direction={"row"} height="64px" alignItems={"center"} gap="1rem">
      <BackButton />
      <Typography
        sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}
        level="h1"
      >
        Testing {editingLevel?.name}
      </Typography>
      <div style={{flex: 1}}></div>
      <Button
        variant="outlined"
        endDecorator={<Construction />}
        onClick={() => {
          if (!editingLevel) return

          abortGame()
          navigateTo("edit", true)

          api.level.levelMapDetail(editingLevel._id).then((level) => {
            setTimeout(() => {
              gameLoopEdit({
                level,
                modifyLevel: (level: Partial<LevelMap>) => {
                  updateLevelMap(level)
                }
              })
            }, 100)
          })
        }}
      >
        Edit
      </Button>
    </Stack>
  )
}
const EditHeader: FC = () => {
  const {editingLevel, isDirty, saveIfDirty} = useLevelContext()
  const {api} = useAuthContext()
  const {navigateTo} = useNavigator()

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
          <IconButton onClick={() => (window.editor.action = "undo")}>
            <Undo />
          </IconButton>
        </Tooltip>
        <Tooltip title="Redo">
        <IconButton onClick={() => (window.editor.action = "redo")}>
          <Redo />
        </IconButton></Tooltip>
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
              navigateTo("test", true)

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

export const subHeaders: Record<MCScreen, JSX.Element> = {
  play: <PlayHeader />,
  edit: <EditHeader />,
  test: <TestHeader />,
  preview: <PreviewHeader />,
  home: <></>,
  levelEditor: <LevelsHeader />,
  highScores: <ViewHeaderSubScreen title="High Scores" />,
  personalHigh: <ViewHeaderSubScreen title="Personal High" />,
  controls: <ViewHeaderSubScreen title="Controls" />,
  login: <ViewHeaderSubScreen title="Login" />,
  createAccount: <ViewHeaderSubScreen title="Create Account" />,
  profile: <ViewHeaderSubScreen title="Profile" />,
  settings: <ViewHeaderSubScreen title="Settings" />,
  editorDetail: <EditLevelDetailHeader />
}
