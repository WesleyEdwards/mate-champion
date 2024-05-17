import {
  Button,
  DialogContent,
  DialogTitle,
  Modal,
  ModalDialog,
  Stack,
  Typography,
} from "@mui/joy";
import { createContext, useContext, useEffect, useState } from "react";
import { MCScreen } from "../components/GameEntry";
import { useLevelContext } from "./useLevels";

type ModalOption = "save" | "pause" | "help";

type PauseModalContextType = {
  setModal: (modal: ModalOption | null) => void;
};

const PauseModalContext = createContext({} as PauseModalContextType);

export const PauseModalProvider = ({
  setScreen,
  children,
}: {
  setScreen: (screen: MCScreen) => void;
  children: React.ReactNode;
}) => {
  const { setGameMode, modifyLevel } = useLevelContext();
  const [open, setOpen] = useState<ModalOption | null>(null);

  const handleSetModal = (modal: ModalOption | null) => {
    setOpen(modal);
  };

  return (
    <PauseModalContext.Provider value={{ setModal: handleSetModal }}>
      {children}

      <Modal open={open === "pause"} onClose={() => {}}>
        <ModalDialog>
          <DialogTitle>Pause</DialogTitle>
          <DialogContent>{"'ESC' to unpause"}</DialogContent>
          <Button
            onClick={() => {
              setGameMode("idle");
              setScreen("home");
              setOpen(null);
            }}
          >
            Quit
          </Button>
        </ModalDialog>
      </Modal>

      <Modal open={open === "save"} onClose={() => {}}>
        <ModalDialog>
          <DialogTitle>Save</DialogTitle>
          <DialogContent>
            Would you like to save your changes before exiting?
          </DialogContent>
          <Stack direction="row" gap="1rem" justifyContent="flex-end">
            <Button
              variant="plain"
              onClick={() => {
                modifyLevel({ discardChanges: true });
                setGameMode("idle");
                setScreen("editorDetail");
                setOpen(null);
              }}
            >
              Exit without saving
            </Button>
            <Button
              onClick={() => {
                modifyLevel({ saveToDb: true });
                setGameMode("idle");
                setScreen("home");
                setOpen(null);
              }}
            >
              Save
            </Button>
          </Stack>
        </ModalDialog>
      </Modal>

      <Modal
        open={open === "help"}
        onClose={() => {
          setOpen(null);
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
  );
};

export const usePauseModalContext = () => {
  const context = useContext(PauseModalContext);
  if (!context.setModal) {
    throw new Error(
      "usePauseModalContext must be used within a PauseModalProvider"
    );
  }
  return context;
};
