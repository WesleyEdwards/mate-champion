import {
  Button,
  DialogContent,
  DialogTitle,
  IconButton,
  Modal,
  ModalDialog,
  Stack
} from "@mui/joy"
import {FC, useState} from "react"
import {Delete} from "@mui/icons-material"
import {useLevelContext} from "../hooks/useLevels"
import {useAuthContext} from "../hooks/useAuth"

export const DeleteLevel: FC<{
  name: string
  id: string
  showWordDelete?: boolean
}> = ({name, id, showWordDelete}) => {
  const [deleting, setDeleting] = useState(false)
  const {setEditingLevel} = useLevelContext()
  const {api} = useAuthContext()
  return (
    <>
      {showWordDelete ? (
        <Stack direction="row" justifyContent="center">
          <Button
            color="danger"
            variant="plain"
            onClick={() => setDeleting(true)}
            endDecorator={<Delete />}
          >
            Delete
          </Button>
        </Stack>
      ) : (
        <IconButton color="danger" onClick={() => setDeleting(true)}>
          <Delete />
        </IconButton>
      )}

      <Modal open={!!deleting} onClose={() => setDeleting(false)}>
        <ModalDialog>
          <DialogTitle>Delete Level</DialogTitle>
          <DialogContent>
            Are you sure you want to delete {name}? This action cannot be undone
          </DialogContent>
          <Stack direction="row" justifyContent="flex-end" gap="2rem">
            <Button variant="plain" onClick={() => setDeleting(false)}>
              Cancel
            </Button>
            <Button
              endDecorator={<Delete />}
              color="danger"
              sx={{alignSelf: "flex-end"}}
              onClick={() => {
                api.level.delete(id).then(() => {
                  setDeleting(false)
                })
                setEditingLevel(null)
              }}
            >
              Delete
            </Button>
          </Stack>
        </ModalDialog>
      </Modal>
    </>
  )
}
