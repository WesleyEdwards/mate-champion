import {FC, useEffect, useState} from "react"
import {ScreenProps} from "./GameEntry"
import {Stack, Typography, Card, Tooltip} from "@mui/joy"
import {useLevelContext} from "../hooks/useLevels"
import {Edit, Visibility, VisibilityOff} from "@mui/icons-material"
import {ListComponent, scrollbarProps} from "./LevelEditorHome"
import {useNavigator} from "../hooks/UseNavigator"
import {LevelInfo} from "../api/serverModels"
import {useAuthContext} from "../hooks/useAuth"
import {CreateNewLevel} from "./CreateNewLevel"

export const MyLevels: FC<ScreenProps> = () => {
  const {api, user} = useAuthContext()
  const {setEditingLevel} = useLevelContext()
  const {navigateTo} = useNavigator()

  const [ownedLevels, setOwnedLevels] = useState<LevelInfo[] | undefined>()

  useEffect(() => {
    api.level.query({owner: {Equal: user?._id ?? ""}}).then(setOwnedLevels)
  }, [])

  return (
    <ListComponent
      items={
        ownedLevels?.map((level) => (
          <Card
            sx={{
              "&:hover": {
                opacity: 0.8,
                cursor: "pointer"
              }
            }}
            onClick={() => {
              setEditingLevel(level._id)
              navigateTo("editorDetail")
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack sx={{overflow: "hidden"}}>
                <Typography
                  level="h4"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  {level.name}
                </Typography>
                <Stack direction="row" gap="5px" alignItems={"center"}>
                  <VisibilityIcon publicLevel={level.public} />
                  <Typography
                    level="body-sm"
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                  >
                    {level.description}
                  </Typography>
                </Stack>
              </Stack>
              <Edit />
            </Stack>
          </Card>
        )) ?? "loading"
      }
      emptyComponent={
        <Stack gap="2rem">
          <Typography textAlign="center">
            You don't have any levels yet
          </Typography>
          <CreateNewLevel text={"Create a level"} />
        </Stack>
      }
    />
  )
}

export const VisibilityIcon = ({publicLevel}: {publicLevel: boolean}) => {
  return (
    <Tooltip title={publicLevel ? "Public" : "Only you can see this level"}>
      <Stack style={{minHeight: "1rem"}} justifyContent="center">
        {publicLevel ? (
          <Visibility sx={{height: "15px"}} />
        ) : (
          <VisibilityOff sx={{height: "15px"}} />
        )}
      </Stack>
    </Tooltip>
  )
}
