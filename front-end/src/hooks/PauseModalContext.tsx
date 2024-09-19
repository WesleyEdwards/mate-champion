import {
  Button,
  DialogContent,
  DialogTitle,
  Modal,
  ModalDialog,
  Stack,
  Typography
} from "@mui/joy"
import {createContext, useContext, useEffect, useState} from "react"
import {MCScreen} from "../components/GameEntry"
import {useLevelContext} from "./useLevels"
import {useNavigator} from "./UseNavigator"

type ModalOption = "save" | "pause" | "help"

type PauseModalContextType = {
  setModal: (modal: ModalOption | null) => void
}

const PauseModalContext = createContext({} as PauseModalContextType)

export const PauseModalProvider = (props: {children: React.ReactNode}) => {
  const {setGameMode} = useLevelContext()
  const {navigateTo} = useNavigator()
  const [open, setOpen] = useState<ModalOption | null>(null)

  const handleSetModal = (modal: ModalOption | null) => {
    setOpen(modal)
  }

  useEffect(() => {
    window.pause = !!open
  }, [open])

  return (
    <PauseModalContext.Provider value={{setModal: handleSetModal}}>
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
                  setGameMode("idle")
                  navigateTo("home")
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
              <li>Ctrl + click to add an item</li>
              <li>Ctrl + D to duplicate item(s)</li>
              <li>'Delete' to delete item(s)</li>
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
