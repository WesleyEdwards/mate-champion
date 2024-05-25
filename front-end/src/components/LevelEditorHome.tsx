import { FC, useEffect, useState } from "react";
import { useAuthContext } from "../hooks/AuthContext";
import { MCScreen, ScreenProps } from "./GameEntry";
import { PartialLevelInfo } from "../Game/models";
import {
  Stack,
  Tab,
  TabList,
  tabClasses,
  TabPanel,
  Tabs,
  Grid,
  Skeleton,
} from "@mui/joy";
import { MyLevels } from "./MyLevels";
import { PublicLevelsScreen } from "./PublicLevelsScreen";

export const LevelEditorHome: FC<ScreenProps> = ({ modifyStats }) => {
  return (
    <Stack maxHeight="calc(100vh - 8rem)">
      <Tabs>
        <TabList
          sx={{
            pt: 1,
            justifyContent: "center",
            "--List-radius": "0px",
            [`&& .${tabClasses.root}`]: {
              flex: "initial",
              bgcolor: "transparent",
              [`&.${tabClasses.selected}`]: {
                color: "primary.plainColor",
                "&::after": {
                  height: 2,
                  borderTopLeftRadius: 3,
                  borderTopRightRadius: 3,
                  bgcolor: "primary.500",
                },
              },
            },
          }}
        >
          <Tab color="neutral">My Levels</Tab>
          <Tab color="neutral">Public Levels</Tab>
        </TabList>

        <TabPanel value={0}>
          <MyLevels score={0} modifyStats={modifyStats} />
        </TabPanel>
        <TabPanel value={1}>
          <PublicLevelsScreen score={0} modifyStats={modifyStats} />
        </TabPanel>
      </Tabs>
    </Stack>
  );
};

export const GridComponent: FC<{ items: React.ReactNode[] | "loading" }> = ({
  items,
}) => (
  <Grid
    container
    spacing={2}
    sx={{
      width: "100%",
      maxHeight: "calc(100vh - 8rem)",
      overflowY: "auto",
      scrollbarColor: "rgb(153, 153, 153) rgba(0, 0, 0, 0)",
      scrollbarWidth: "thin",
      scrollbarGutter: "auto",
    }}
  >
    {(items === "loading"
      ? new Array(12).fill(
          <Skeleton
            sx={{ minWidth: "10rem", width: "100%" }}
            variant="rectangular"
            height="50px"
          />
        )
      : items
    ).map((item, index) => (
      <Grid xs={12} sm={6} md={6} lg={4} key={index}>
        {item}
      </Grid>
    ))}
  </Grid>
);
