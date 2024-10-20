import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormHelperText,
  Skeleton,
  Stack,
  Textarea
} from "@mui/joy"
import {FC, useEffect, useState} from "react"
import {ScreenProps} from "./GameEntry"
import {DeleteLevel} from "./DeleteLevel"
import {useLevelContext} from "../hooks/useLevels"
import {useNavigator} from "../hooks/UseNavigator"
import {VisibilityIcon} from "./MyLevels"
import {useAuthContext} from "../hooks/useAuth"
import {MCModal} from "./MCModal"
import {SignInButton} from "./SignInButton"
import {Construction} from "@mui/icons-material"
import {gameLoopEdit} from "../game/editor/gameLoopEdit"
import {LevelMap} from "../game/loopShared/models"

export const EditLevelDetail: FC = () => {
  const {api, user} = useAuthContext()
  const {editingLevel, updateLevelMap} = useLevelContext()
  const {navigateTo} = useNavigator()

  const [saving, setSaving] = useState(false)

  const [levelForm, setLevelForm] = useState<{
    public: boolean
    description: string
  }>({public: true, description: ""})

  useEffect(() => {
    if (editingLevel && editingLevel !== "loading") {
      setLevelForm({
        public: editingLevel.public,
        description: editingLevel.description ?? ""
      })
    }
  }, [editingLevel])

  if (editingLevel === "loading") {
    return (
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
    )
  }

  if (!editingLevel) {
    navigateTo("home")
    return null
  }

  return (
    <Stack gap="2rem" width="100%" flexGrow={1}>
      <Textarea
        value={levelForm.description ?? ""}
        placeholder="Description"
        minRows={2}
        onChange={(e) => {
          setLevelForm((prev) => ({...prev, description: e.target.value}))
        }}
        sx={{flexGrow: 1}}
      />

      <Button
        size="lg"
        fullWidth
        variant="outlined"
        endDecorator={<Construction />}
        onClick={() => {
          navigateTo("edit")

          api.level.levelMapDetail(editingLevel._id).then((level) => {
            gameLoopEdit({
              level,
              modifyLevel: (level: Partial<LevelMap>) => {
                updateLevelMap(level)
              }
            })
          })
        }}
      >
        Edit
      </Button>

      <FormControl>
        {user ? (
          <Checkbox
            label="Public"
            checked={levelForm.public}
            onChange={(e) => {
              setLevelForm((prev) => ({...prev, public: e.target.checked}))
            }}
          />
        ) : (
          <FakePublicOption />
        )}
        <FormHelperText>
          <VisibilityIcon publicLevel={levelForm.public} />
          {levelForm.public
            ? "Anyone can see this level"
            : "Only you can see this level"}
        </FormHelperText>
      </FormControl>

      <Button
        sx={{alignSelf: "flex-end"}}
        onClick={() => {
          setSaving(true)
          api.level
            .modify(editingLevel._id, levelForm)
            .then(() => setSaving(false))
        }}
        disabled={
          levelForm.description === (editingLevel.description ?? "") &&
          levelForm.public === editingLevel.public
        }
        loading={saving}
      >
        Save
      </Button>

      <Divider />

      <DeleteLevel
        name={editingLevel.name}
        id={editingLevel._id}
        showWordDelete
      />
    </Stack>
  )
}

const FakePublicOption = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Checkbox
        label="Public"
        checked={false}
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
