import {
  Button,
  DialogContent,
  DialogTitle,
  IconButton,
  Modal,
  ModalDialog,
} from "@mui/joy";
import { FC, useState } from "react";
import { PartialLevelInfo } from "../Game/models";
import { useLevelContext } from "../hooks/LevelsContext";
import { Delete } from "@mui/icons-material";

export const DeleteLevel: FC<{
  name: string;
  id: string;
  showWordDelete?: boolean;
}> = ({ name, id, showWordDelete }) => {
  const [deleting, setDeleting] = useState(false);
  const { deleteLevel } = useLevelContext();
  return (
    <>
      {showWordDelete ? (
        <Button
          color="danger"
          onClick={() => setDeleting(true)}
          endDecorator={<Delete />}
        >
          Delete
        </Button>
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
          <Button
            endDecorator={<Delete />}
            color="danger"
            sx={{ alignSelf: "flex-end" }}
            onClick={() =>
              deleteLevel(id ?? "").then(() => {
                setDeleting(false);
              })
            }
          >
            Delete
          </Button>
        </ModalDialog>
      </Modal>
    </>
  );
};