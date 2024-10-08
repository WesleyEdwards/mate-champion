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
              <li>Click and drag to move</li>
              <li>Click to select</li>
              <li>Ctrl + click to add an item</li>
              <li>'Delete' to delete an item</li>
              <li>Shift + drag to add or remove width</li>
              <li>Ctrl + plus to add width</li>
              <li>Ctrl + minus to subtract width</li>
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
