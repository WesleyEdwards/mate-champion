import {
  Alert,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
  Typography
} from "@mui/joy"
import {FC, useEffect} from "react"

export const MCModal: FC<{
  title: string
  open: boolean
  onClose: () => void
  onConfirm: () => void
  disableConfirm?: boolean
  confirmLabel?: string
  subtext?: string
  error?: string
  hideActions?: boolean
  children: React.ReactNode
}> = ({
  title,
  open,
  onClose,
  onConfirm,
  confirmLabel = "Save",
  disableConfirm = false,
  subtext,
  error = "",
  hideActions,
  children
}) => {
  useEffect(() => {
    window.pause = open
  }, [open])

  // https://stackoverflow.com/questions/75644447/autofocus-not-working-on-open-form-dialog-with-button-component-in-material-ui-v
  return (
    <Modal open={open} onClose={onClose} disableRestoreFocus>
      {/* <form onSubmit={onConfirm}> */}
      <ModalDialog variant="outlined" role="alertdialog">
        <ModalClose sx={{zIndex: 8}} />
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Stack gap="2rem" mt="1rem">
            <Typography>{subtext}</Typography>

            {children}
            {error && (
              <Alert variant="soft" color="danger">
                {error}
              </Alert>
            )}
          </Stack>
        </DialogContent>
        {!hideActions && (
          <DialogActions>
            <Button
              disabled={disableConfirm}
              variant="soft"
              color="success"
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
            <Button variant="plain" color="neutral" onClick={onClose}>
              Cancel
            </Button>
          </DialogActions>
        )}
      </ModalDialog>
      {/* </form> */}
    </Modal>
  )
}
