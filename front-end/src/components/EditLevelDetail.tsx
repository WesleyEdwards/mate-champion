import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  Skeleton,
  Stack,
  Tooltip,
  Typography
} from "@mui/joy"
import {FC, useEffect, useState} from "react"
import {DeleteLevel} from "./DeleteLevel"
import {VisibilityIcon} from "./MyLevels"
import {useAuthContext} from "../hooks/useAuth"
import {MCModal} from "./MCModal"
import {SignInButton} from "./SignInButton"
import {ArrowBack, Check, Construction, Edit, Undo} from "@mui/icons-material"
import {useToast} from "../hooks/Toaster"
import {useNavigate, useParams} from "react-router-dom"
import {MScreen} from "./AuthSwitch"
import {abortGame} from "../game/editor/eventListeners"
import {LevelInfo} from "../api/serverModels"

export const EditLevelDetail = () => {
  const {api, user} = useAuthContext()
  const {id} = useParams<{id: string}>()
  const navigate = useNavigate()
  const toast = useToast()

  const [levelInfo, setLevelInfo] = useState<LevelInfo>()

  useEffect(() => {
    if (id) {
      api.level.detail(id).then(setLevelInfo)
    }
  }, [id])

  if (levelInfo === undefined) {
    return (
      <MScreen>
        <Stack
          gap="1rem"
          alignItems="center"
          height="300px"
          width="546px"
          mt="1rem"
        >
          <Skeleton height="20px" variant="rectangular" />
          <Skeleton height="100%" variant="rectangular" />
        </Stack>
      </MScreen>
    )
  }

  return (
    <MScreen>
      <EditLevelDetailHeader
        editingLevel={levelInfo}
        setName={(name) => setLevelInfo({...levelInfo, name})}
      />
      <Stack gap="4rem">
        <Button
          size="lg"
          fullWidth
          sx={{
            backgroundColor: "#0b6bcb",
            "&:hover": {
              backgroundColor: "#084989"
            }
          }}
          endDecorator={<Construction />}
          onClick={() => {
            navigate("edit")
          }}
        >
          Edit
        </Button>

        <FormControl>
          {user ? (
            <Checkbox
              label="Public"
              checked={levelInfo.public}
              sx={{alignSelf: "start"}}
              onChange={(e) => {
                const p = e.target.checked
                setLevelInfo((prev) => (prev ? {...prev, public: p} : prev))
                api.level.modify(levelInfo._id, {public: p}).then(() => {
                  toast({
                    message: `This level is now ${p ? "public" : "private"}`
                  })
                })
              }}
            />
          ) : (
            <FakePublicOption />
          )}
          <FormHelperText>
            <VisibilityIcon publicLevel={levelInfo.public} />
            {levelInfo.public
              ? "Anyone can see this level"
              : "Only you can see this level"}
          </FormHelperText>
        </FormControl>

        <Divider />

        <DeleteLevel name={levelInfo.name} id={levelInfo._id} showWordDelete />
      </Stack>
    </MScreen>
  )
}

const FakePublicOption = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Checkbox
        label="Public"
        checked={false}
        sx={{alignSelf: "start"}}
        onChange={() => {
          setOpen(true)
        }}
      />
      <MCModal
        title={"Create an Account"}
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        hideActions
        subtext="Sign in so others can see what you've made!"
      >
        <SignInButton />
      </MCModal>
    </>
  )
}

const EditLevelDetailHeader = (props: {
  editingLevel: LevelInfo
  setName: (name: string) => void
}) => {
  const {editingLevel, setName} = props
  const navigate = useNavigate()
  const [editingName, setEditingName] = useState<string>()
  const {api} = useAuthContext()
  const toast = useToast()

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
              navigate(-1)
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
                setName(editingName)
                api.level
                  .modify(editingLevel._id, {name: editingName})
                  .then(() => {
                    toast({message: "Level name successfully changed"})
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
