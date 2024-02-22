import {
  Button,
  DialogContent,
  DialogTitle,
  Modal,
  ModalDialog,
} from "@mui/joy";
import { createContext, useContext, useState } from "react";
import { useLevelContext } from "./LevelsContext";
import { MCScreen } from "../components/GameEntry";

type PauseModalContextType = {
  open: boolean;
  openPauseModal: (open: boolean) => void;
};

const PauseModalContext = createContext({} as PauseModalContextType);

export const PauseModalProvider = ({
  setScreen,
  children,
}: {
  setScreen: (screen: MCScreen) => void;
  children: React.ReactNode;
}) => {
  const { setGameMode } = useLevelContext();
  const [open, setOpen] = useState(false);

  return (
    <PauseModalContext.Provider value={{ open, openPauseModal: setOpen }}>
      {children}
      <Modal open={open} onClose={() => {}}>
        <ModalDialog>
          <DialogTitle>Pause</DialogTitle>
          <DialogContent>{"'ESC' to unpause"}</DialogContent>
          <Button
            onClick={() => {
              window.stopLoop = true;
              setGameMode("play");
              setScreen("home");
              setOpen(false);
            }}
          >
            Quit
          </Button>
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
