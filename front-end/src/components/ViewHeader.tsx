import {
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
  Edit,
  Sync,
  Undo
} from "@mui/icons-material"
import {FC, useState} from "react"
import {useLevelContext} from "../hooks/useLevels"
import {CreateNewLevel} from "./CreateNewLevel"
import {useNavigator} from "../hooks/UseNavigator"
import {abortController} from "../game/editor/eventListeners"
import {useAuthContext} from "../hooks/useAuth"

export const ViewHeaderSubScreen: FC<{
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

export const LevelsHeader: FC = () => {
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

export const ViewHeaderMainScreen: FC<{title: string}> = ({title}) => {
  return (
    <Stack alignItems="center" width="100%">
      <Typography level="h2">{title}</Typography>
    </Stack>
  )
}

export const EditLevelDetailHeader: FC = () => {
  const {goBack} = useNavigator()
  const [editingName, setEditingName] = useState<string>()
  const {api} = useAuthContext()
  const {editingLevel, setEditingLevel} = useLevelContext()

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
              setEditingLevel(null)
              abortController.abort()
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
                api.level.modify(editingLevel._id, {
                  name: editingName
                })
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

export const PlayingHeader: FC = () => {
  const {editingLevel, gameMode, setGameMode, isDirty} = useLevelContext()
  const {goBack} = useNavigator()

  if (gameMode === "play") return null

  if (editingLevel === "loading") {
    return <Skeleton height="40px" variant="rectangular" />
  }

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      width="100%"
    >
      <IconButton
        onClick={() => {
          abortController.abort()
          setGameMode("idle")
          goBack()
        }}
      >
        <ArrowBack />
      </IconButton>

      {gameMode === "edit" && (
        <Typography
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "700px"
          }}
          level="h1"
        >
          Editing {editingLevel?.name}
        </Typography>
      )}
      {gameMode === "test" && (
        <Typography
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "700px"
          }}
          level="h1"
        >
          {editingLevel?.name}
        </Typography>
      )}
      <Stack
        direction={"row"}
        gap="5px"
        justifyContent={"center"}
        alignItems={"center"}
        width="2rem"
        mr="1rem"
        sx={{opacity: 0.3, mb: "10px", position: "relative", right: "2rem"}}
      >
        {(() => {
          if (gameMode !== "edit") {
            return null
          }
          if (isDirty) {
            return (
              <>
                <Sync />
                <Typography level="body-lg" variant="plain">
                  Saving...
                </Typography>
              </>
            )
          }
          return (
            <>
              <Typography level="body-lg" variant="plain">
                Saved
              </Typography>
              <CheckCircle />
            </>
          )
        })()}
      </Stack>
    </Stack>
  )
}
