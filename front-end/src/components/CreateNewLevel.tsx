import { FC, useEffect, useState } from "react";
import { ScreenProps } from "./GameEntry";
import {
  Button,
  Divider,
  Input,
  Stack,
  Card,
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
  const { user, api } = useAuthContext();
  const { setEditingLevel, setOwnedLevels } = useLevelContext();
  const { navigateTo } = useNavigator();

  const [creating, setCreating] = useState(false);

  const [makingNew, setMakingNew] = useState<string>();

  if (!user) throw new Error("User must be authenticated");

  const createLevel = async (name: string) => {
    const created = await api.level.create({
      _id: crypto.randomUUID(),
      owner: user?._id ?? "",
      description: null,
      creatorName: user?.name ?? "",
      endPosition: 4500,
      public: false,
      name: name,
      opponents: { grog: [] },
      packages: [],
      floors: [{ x: -500, width: 7000, color: "green" }],
      platforms: [],
    });
    setEditingLevel(created);
    setOwnedLevels((prev) => (prev ? [...prev, created] : prev));
    return created;
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
