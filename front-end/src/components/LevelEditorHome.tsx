import { FC, useState } from "react";
import { ScreenProps } from "./GameEntry";
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
import { localStorageManager } from "../api/localStorageManager";

export const LevelEditorHome: FC<ScreenProps> = ({ modifyStats }) => {
  const [value, setValue] = useState<number>(
    +localStorageManager.get("level-tab")
  );
  return (
    <Stack maxHeight="calc(100vh - 8rem)">
      <Tabs
        value={value}
        onChange={(_, v) => {
          if (typeof v === "number") {
            localStorageManager.set("level-tab", v);
            setValue(v);
          }
        }}
      >
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
      ? new Array(15).fill(
          <Skeleton
            sx={{ minWidth: "10rem", width: "100%" }}
            variant="rectangular"
            height="80px"
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
