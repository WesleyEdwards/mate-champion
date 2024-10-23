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
import {useToast} from "../hooks/Toaster"

export const EditLevelDetail: FC = () => {
  const {api, user} = useAuthContext()
  const {editingLevel, updateEditingLevel, updateLevelMap} = useLevelContext()
  const {navigateTo} = useNavigator()
  const toast = useToast()

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
    <Stack gap="4rem">
      {/* <Textarea
        value={levelForm.description ?? ""}
        placeholder="Description"
        minRows={2}
        onChange={(e) => {
          setLevelForm((prev) => ({...prev, description: e.target.value}))
        }}
        sx={{flexGrow: 1}}
      /> */}

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
            checked={editingLevel.public}
            sx={{alignSelf: "start"}}
            onChange={(e) => {
              const p = e.target.checked
              updateEditingLevel({public: p})
              api.level.modify(editingLevel._id, {public: p}).then(() => {
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
          <VisibilityIcon publicLevel={editingLevel.public} />
          {editingLevel.public
            ? "Anyone can see this level"
            : "Only you can see this level"}
        </FormHelperText>
      </FormControl>

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
