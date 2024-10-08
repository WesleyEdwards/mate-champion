import {FC, useEffect, useState} from "react"
import {ScreenProps} from "./GameEntry"
import {LevelInfo} from "../game/loopShared/models"
import {Card, IconButton, Stack, Typography} from "@mui/joy"
import {PlayArrow} from "@mui/icons-material"
import {usePauseModalContext} from "../hooks/PauseModalContext"
import {useLevelContext} from "../hooks/useLevels"
import {GridComponent} from "./LevelEditorHome"
import {useNavigator} from "../hooks/UseNavigator"
import {enterGameLoopPreview} from "../game/previewer/previewLoop"

export const PublicLevelsScreen: FC<ScreenProps> = ({modifyStats}) => {
  const {setGameMode, levelCache} = useLevelContext()
  const {navigateTo} = useNavigator()
  const [levels, setLevels] = useState<LevelInfo[]>()

  const handleEnterGamePlay = async (levelId: string) => {
    const fullLevel = await levelCache.read.getFull(levelId)

    navigateTo("game")
    setGameMode("test")

    enterGameLoopPreview(fullLevel)
  }

  useEffect(() => {
    setLevels(undefined)
    levelCache.read.public().then(setLevels)
  }, [])

  return (
    <>
      <GridComponent
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
      />
    </>
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
