import {FC, useEffect, useState} from "react"
import {Card, IconButton, Stack, Typography} from "@mui/joy"
import {PlayArrow} from "@mui/icons-material"
import {ListComponent} from "./LevelEditorHome"
import {useAuthContext} from "../hooks/useAuth"
import {SignInButton} from "./SignInButton"
import {useNavigate} from "react-router-dom"
import {LevelInfo} from "../api/types"

export const PublicLevelsScreen = () => {
  const {api, user} = useAuthContext()
  const navigate = useNavigate()
  const [levels, setLevels] = useState<LevelInfo[]>()

  useEffect(() => {
    setLevels(undefined)
    if (!user) {
      return setLevels([])
    }
    api.level.query({condition: {public: {Equal: true}}}).then(setLevels)
  }, [])

  return (
    <ListComponent
      items={
        levels?.map((level) => (
          <LevelCard
            level={level}
            subtitle={level.creatorName}
            actionButton={
              <IconButton
                onClick={() => {
                  navigate(`/levels/${level._id}/preview`)
                }}
                color="success"
              >
                <PlayArrow />
              </IconButton>
            }
          />
        )) ?? "loading"
      }
      emptyComponent={
        <Stack gap="2rem">
          <Typography textAlign="center">
            Sign in to see levels that <br /> other people have made!
          </Typography>
          <SignInButton />
        </Stack>
      }
    />
  )
}

const LevelCard: FC<{
  level: LevelInfo
  subtitle?: string
  actionButton: React.ReactNode
}> = ({level, actionButton, subtitle}) => (
  <Card key={level._id} sx={{width: "100%"}}>
    <Stack direction="row" justifyContent="space-between" alignItems="center">
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
        {subtitle && <Typography level="body-sm">{subtitle}</Typography>}
      </Stack>
      {actionButton}
    </Stack>
  </Card>
)
