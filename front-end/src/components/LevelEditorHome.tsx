import {CSSProperties, FC, useMemo, useState} from "react"
import {
  Stack,
  Tab,
  TabList,
  tabClasses,
  TabPanel,
  Tabs,
  Skeleton
} from "@mui/joy"
import {MyLevels} from "./MyLevels"
import {PublicLevelsScreen} from "./PublicLevelsScreen"
import {MScreen} from "./AuthSwitch"
import {LevelsHeader} from "./ViewHeader"
import {useSearchParams} from "react-router-dom"

export const LevelEditorHome = () => {
  const [params, setParams] = useSearchParams()

  const tab = useMemo(() => (params.get("view") === "public" ? 1 : 0), [params])

  const setTab = (v: number) => {
    params.set("view", v === 0 ? "mine" : "public")
    setParams(params, {replace: true})
  }

  return (
    <MScreen>
      <LevelsHeader />
      <Stack maxHeight="calc(100vh - 8rem)">
        <Tabs
          value={tab}
          onChange={(_, v) => {
            if (typeof v === "number") {
              setTab(v)
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
                    bgcolor: "primary.500"
                  }
                }
              }
            }}
          >
            <Tab color="neutral">My Levels</Tab>
            <Tab color="neutral">Public Levels</Tab>
          </TabList>

          <TabPanel value={0}>
            <MyLevels />
          </TabPanel>
          <TabPanel value={1} sx={{paddingInline: "0rem"}}>
            <PublicLevelsScreen />
          </TabPanel>
        </Tabs>
      </Stack>
    </MScreen>
  )
}

export const ListComponent: FC<{
  items: React.ReactNode[] | "loading"
  emptyComponent: React.ReactNode
}> = ({items, emptyComponent}) => (
  <Stack
    gap="1rem"
    sx={{height: "70vh", overflowY: "scroll", ...scrollbarProps}}
  >
    {(items === "loading"
      ? new Array(15).fill(
          <Skeleton
            sx={{minWidth: "10rem", width: "100%"}}
            variant="rectangular"
            height="80px"
          />
        )
      : items
    ).map((item, index) => (
      <div key={index}>{item}</div>
    ))}
    {items.length === 0 && <Stack mt="18rem">{emptyComponent}</Stack>}
  </Stack>
)

export const scrollbarProps: CSSProperties = {
  scrollbarColor: "rgb(153, 153, 153) rgba(0, 0, 0, 0)",
  scrollbarWidth: "thin",
  scrollbarGutter: "auto"
}
