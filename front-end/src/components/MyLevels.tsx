import { FC, useEffect, useState } from "react";
import { ScreenProps } from "./GameEntry";
import { Stack, Typography, Card } from "@mui/joy";
import { useLevelContext } from "../hooks/useLevels";
import { Edit } from "@mui/icons-material";
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
          >
            <Stack
              onClick={() => {
                setEditingLevel(level);
                navigateTo("editorDetail");
              }}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography level="h4">{level.name}</Typography>
              <div style={{ flexGrow: 1 }}></div>
              <Stack direction="row" gap="1rem">
                <Edit />
              </Stack>
            </Stack>
          </Card>
        )) ?? "loading"
      }
    />
  );
};
