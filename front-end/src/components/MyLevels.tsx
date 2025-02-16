import {FC, useEffect, useState} from "react"
import {Stack, Typography, Card, Tooltip} from "@mui/joy"
import {Edit, Visibility, VisibilityOff} from "@mui/icons-material"
import {ListComponent} from "./LevelEditorHome"
import {useAuthContext} from "../hooks/useAuth"
import {CreateNewLevel} from "./CreateNewLevel"
import {useNavigate} from "react-router-dom"
import {LevelInfo} from "../api/types"

export const MyLevels = () => {
  const {api, user} = useAuthContext()
  const navigate = useNavigate()

  const [ownedLevels, setOwnedLevels] = useState<LevelInfo[] | undefined>()

  useEffect(() => {
    api.level
      .query({condition: {owner: {Equal: user?._id ?? ""}}})
      .then(setOwnedLevels)
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
              navigate(level._id)
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
    <Tooltip
      title={publicLevel ? "Public" : "Right now, only you can see this level"}
    >
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
