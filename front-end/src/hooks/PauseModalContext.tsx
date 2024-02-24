import {
  Button,
  DialogContent,
  DialogTitle,
  Modal,
  ModalDialog,
  Stack,
} from "@mui/joy";
import { createContext, useContext, useEffect, useState } from "react";
import { useLevelContext } from "./LevelsContext";
import { MCScreen } from "../components/GameEntry";

type PauseModalContextType = {
  setModal: (modal: "save" | "pause" | null) => void;
};

const PauseModalContext = createContext({} as PauseModalContextType);

export const PauseModalProvider = ({
  setScreen,
  children,
}: {
  setScreen: (screen: MCScreen) => void;
  children: React.ReactNode;
}) => {
  const { setGameMode, saveLevelToDb } = useLevelContext();
  const [open, setOpen] = useState<"save" | "pause" | null>(null);

  const handleSetModal = (modal: "save" | "pause" | null) => {
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
              window.stopLoop = true;
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
                window.stopLoop = true;
                setGameMode("idle");
                setScreen("home");
                setOpen(null);
              }}
            >
              Exit without saving
            </Button>
            <Button
              onClick={() => {
                saveLevelToDb();
                window.stopLoop = true;
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
    </PauseModalContext.Provider>
  );
};

export const usePauseModalContext = () => {
  const context = useContext(PauseModalContext);
  if (!context) {
    throw new Error(
      "usePauseModalContext must be used within a PauseModalProvider"
    );
  }
  return context;
};
