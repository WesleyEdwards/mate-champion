import {useEffect, useState} from "react"
import {useAuthContext} from "../../hooks/useAuth"
import {useParams} from "react-router-dom"
import {BackButton} from "../ViewHeader"
import {MScreen} from "../Layout"
import {enterGameLoopPreview} from "../../game/previewer/previewLoop"
import {abortGame} from "../../game/editor/eventListeners"
import {LevelInfo, LevelMap} from "../../api/serverModels"
import {Skeleton, Stack, Typography} from "@mui/joy"

export const PreviewScreen = () => {
  const {id} = useParams<{id: string}>()

  const {api} = useAuthContext()

  const [levelInfo, setLevelInfo] = useState<LevelInfo>()
  const [fullLevel, setFullLevel] = useState<LevelMap>()

  useEffect(() => {
    if (id) {
      api.level.detail(id).then(setLevelInfo)
      api.level.levelMapDetail(id).then(setFullLevel)
    }
  }, [id])

  useEffect(() => {
    if (fullLevel) {
      enterGameLoopPreview(fullLevel)
    }
    return () => {
      abortGame()
    }
  }, [fullLevel])

  return (
    <MScreen>
      <PreviewHeader editingLevel={levelInfo} />
      <canvas style={{borderRadius: "10px"}} id="canvas"></canvas>
    </MScreen>
  )
}
const PreviewHeader = (props: {editingLevel?: LevelInfo}) => {
  const {editingLevel} = props

  if (!editingLevel) {
    return <Skeleton height="40px" variant="rectangular" />
  }

  return (
    <Stack direction={"row"} height="64px" alignItems={"center"} gap="1rem">
      <BackButton />
      <Typography
        sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}
        level="h1"
      >
        {editingLevel?.name}
      </Typography>
    </Stack>
  )
}
