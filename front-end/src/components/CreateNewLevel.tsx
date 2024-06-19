import { FC, useEffect, useState } from "react";
import {
  Button,
  Input,
  Stack,
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
} from "@mui/joy";
import { Add } from "@mui/icons-material";
import { useAuthContext } from "../hooks/useAuth";
import { useLevelContext } from "../hooks/useLevels";
import { useNavigator } from "../hooks/UseNavigator";

export const CreateNewLevel: FC<{ text: string }> = ({ text }) => {
  const { user } = useAuthContext();
  const { setEditingLevel, levelCache } = useLevelContext();
  const { navigateTo } = useNavigator();

  const [creating, setCreating] = useState(false);

  const [makingNew, setMakingNew] = useState<string>();

  if (!user) throw new Error("User must be authenticated");

  const createLevel = async (name: string) => {
    const createdLevel = await levelCache.update.create({
      _id: crypto.randomUUID(),
      owner: user?._id ?? "",
      description: null,
      creatorName: user?.name ?? "",
      public: false,
      name: name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setEditingLevel(createdLevel._id);
  };

  return (
    <>
      <Button
        onClick={() => {
          setMakingNew("");
        }}
        loading={creating}
        endDecorator={<Add />}
      >
        {text}
      </Button>

      <Modal
        open={makingNew !== undefined}
        onClose={() => setMakingNew(undefined)}
      >
        <ModalDialog>
          <DialogTitle>New Level</DialogTitle>
          <DialogContent>Choose a name for your new level</DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setCreating(true);
              createLevel(makingNew ?? "").then(() => {
                setCreating(false);
                navigateTo("editorDetail");
              });
            }}
          >
            <Stack gap="1rem">
              <Input
                value={makingNew}
                onChange={(e) => setMakingNew(e.target.value)}
                placeholder="My level"
              />
              <Button
                disabled={!makingNew}
                sx={{ alignSelf: "flex-end" }}
                type="submit"
              >
                Create
              </Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </>
  );
};
