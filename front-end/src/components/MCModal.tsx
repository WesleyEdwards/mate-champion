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
  children
}) => {
  useEffect(() => {
    window.pause = open
  }, [open])

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog variant="outlined" role="alertdialog">
        <ModalClose />
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
      </ModalDialog>
    </Modal>
  )
}
