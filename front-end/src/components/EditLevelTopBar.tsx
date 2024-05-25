import { Close } from "@mui/icons-material";
import { Alert, IconButton, Stack, Typography } from "@mui/joy";
import { useLevelContext } from "../hooks/useLevels";
import { useNavigator } from "../hooks/UseNavigator";

export const EditLevelTopBar = () => {
  const { editingLevel, setEditingLevel } = useLevelContext();
  const { resetStack } = useNavigator();

  if (!editingLevel) return null;

  return (
    <Alert
      variant="soft"
      color="success"
      size="lg"
      sx={{ width: "100%", borderRadius: 0, position: "fixed" }}
    >
      <Stack
        width="100%"
        direction="row"
        alignItems="center"
        justifyContent={"space-between"}
      >
        <Typography>
          Editing <b>{editingLevel.name}</b>
        </Typography>
        <IconButton
          sx={{ borderRadius: "0.5rem" }}
          onClick={() => {
            setEditingLevel(null);
            resetStack();
          }}
        >
          <Close />
        </IconButton>
      </Stack>
    </Alert>
  );
};
