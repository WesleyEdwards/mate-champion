import { FC, useEffect, useState } from "react";
import { ScreenProps } from "./GameEntry";
import { Stack, Typography, Card, Tooltip } from "@mui/joy";
import { useLevelContext } from "../hooks/useLevels";
import { Edit, Visibility, VisibilityOff } from "@mui/icons-material";
import { GridComponent } from "./LevelEditorHome";
import { useNavigator } from "../hooks/UseNavigator";

export const MyLevels: FC<ScreenProps> = () => {
  const { setEditingLevel, ownedLevels } = useLevelContext();
  const { navigateTo } = useNavigator();

  return (
    <GridComponent
      items={
        ownedLevels?.map((level) => (
          <Card
            sx={{
              "&:hover": {
                opacity: 0.8,
                cursor: "pointer",
              },
            }}
            onClick={() => {
              setEditingLevel(level);
              navigateTo("editorDetail");
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack>
                <Typography level="h4">{level.name}</Typography>
                <Stack direction="row" gap="5px" alignItems={"center"}>
                  <VisibilityIcon publicLevel={level.public} />
                  <Typography level="body-sm">{level.description}</Typography>
                </Stack>
              </Stack>
              <Edit />
            </Stack>
          </Card>
        )) ?? "loading"
      }
    />
  );
};

export const VisibilityIcon = ({ publicLevel }: { publicLevel: boolean }) => {
  return (
    <Tooltip title={publicLevel ? "Public" : "Only you can see this level"}>
      <Stack style={{ minHeight: "1rem" }} justifyContent="center">
        {publicLevel ? (
          <Visibility sx={{ height: "15px" }} />
        ) : (
          <VisibilityOff sx={{ height: "15px" }} />
        )}
      </Stack>
    </Tooltip>
  );
};
