import {FC, useEffect, useState} from "react"
import {LevelInfo} from "../api/serverModels"
import {Card, IconButton, Stack, Typography} from "@mui/joy"
import {PlayArrow} from "@mui/icons-material"
import {useLevelContext} from "../hooks/useLevels"
import {ListComponent} from "./LevelEditorHome"
import {useAuthContext} from "../hooks/useAuth"
import {SignInButton} from "./SignInButton"
import {useNavigate} from "react-router-dom"

export const PublicLevelsScreen = () => {
  const {api, user} = useAuthContext()
  const {setEditingLevel} = useLevelContext()
  const navigate = useNavigate()
  const [levels, setLevels] = useState<LevelInfo[]>()

  const handleEnterGamePlay = async (levelId: string) => {
    navigate(`/levels/${levelId}/preview`)
    setEditingLevel(levelId)
  }

  useEffect(() => {
    setLevels(undefined)
    if (!user) {
      return setLevels([])
    }
    api.level.query({public: {Equal: true}}).then(setLevels)
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
                  handleEnterGamePlay(level._id)
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
