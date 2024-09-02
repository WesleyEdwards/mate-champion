import {Edit, Check} from "@mui/icons-material"
import {
  Button,
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  Stack
} from "@mui/joy"
import {useState} from "react"
import {HexColorPicker} from "react-colorful"

export const ColorPicker = ({
  color,
  setColor,
  buttonLabel
}: {
  color: string
  setColor: (c: string) => void
  buttonLabel: string
}) => {
  const [open, setOpen] = useState(false)
  const [dirty, setDirty] = useState(color)
  return (
    <>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        endDecorator={<Edit />}
      >
        {buttonLabel}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>Select a color</DialogTitle>
          <DialogContent>
            <Stack sx={{margin: "2rem"}} justifyContent={"center"}>
              <HexColorPicker color={dirty} onChange={setDirty} />
            </Stack>
          </DialogContent>
          <Stack direction="row" justifyContent="flex-end" gap="1rem">
            <Button variant="plain" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              endDecorator={<Check />}
              onClick={() => {
                setColor(dirty)
                setOpen(false)
              }}
            >
              Apply
            </Button>
          </Stack>
        </ModalDialog>
      </Modal>
    </>
  )
}
