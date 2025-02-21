import {
  Button,
  DialogContent,
  DialogTitle,
  Modal,
  ModalDialog,
  Stack
} from "@mui/joy"
import {createContext, useContext, useEffect, useState} from "react"
import {emptyStats} from "../game/loopShared/utils"
import {PlayStats} from "../game/state/models"

type ModalOption = "save" | "pause" | "help"

type PauseModalContextType = {
  setModal: (modal: ModalOption | null) => void
  modifyStats: (newStats: Partial<PlayStats>) => void
  stats: PlayStats
}

const PauseModalContext = createContext({} as PauseModalContextType)

export const PauseModalProvider = (props: {children: React.ReactNode}) => {
  const [open, setOpen] = useState<ModalOption | null>(null)
  const [stats, modifyStats] = useState<PlayStats>({...emptyStats})

  const handleSetModal = (modal: ModalOption | null) => {
    setOpen(modal)
  }

  return (
    <PauseModalContext.Provider
      value={{
        setModal: handleSetModal,
        modifyStats: (s) => modifyStats((prev) => ({...prev, ...s})),
        stats
      }}
    >
      {props.children}

      <Modal open={open === "pause"} onClose={() => {}}>
        <ModalDialog>
          <DialogTitle>Pause</DialogTitle>
          <DialogContent>
            <Stack gap="1rem" my="1rem">
              <Button
                onClick={() => {
                  setOpen(null)
                }}
              >
                Continue
              </Button>
              <Button
                onClick={() => {
                  window.location.assign("/landing")
                  setOpen(null)
                }}
              >
                Quit
              </Button>
            </Stack>
          </DialogContent>
        </ModalDialog>
      </Modal>

      <Modal
        open={open === "help"}
        onClose={() => {
          setOpen(null)
        }}
      >
        <ModalDialog>
          <DialogTitle>Level Creator</DialogTitle>
          <DialogContent>
            <ul>
              <li>Drag an item to move it</li>
              <li>Ctrl + click to select multiple items</li>
              <li>Shift + Drag to select multiple items</li>
              <li>Ctrl + click to add an item</li>
              <li>Ctrl + D to duplicate item(s)</li>
              <li>'Delete' to delete item(s)</li>
              <li>Ctrl + Z to undo</li>
              <li>Ctrl + Shift +Z to redo</li>
              <li>Drag corner of platform to resize</li>
            </ul>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </PauseModalContext.Provider>
  )
}

export const usePauseModalContext = () => {
  const context = useContext(PauseModalContext)
  if (!context.setModal) {
    throw new Error(
      "usePauseModalContext must be used within a PauseModalProvider"
    )
  }
  return context
}
