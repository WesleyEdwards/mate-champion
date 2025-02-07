import {useEffect, useState} from "react"
import {useAuthContext} from "../../hooks/useAuth"
import {useNavigate, useParams} from "react-router-dom"
import {BackButton} from "../ViewHeader"
import {MScreen} from "../AuthSwitch"
import {enterGameLoopPreview} from "../../game/previewer/previewLoop"
import {abortGame} from "../../game/editor/eventListeners"
import {Button, Skeleton, Stack, Typography} from "@mui/joy"
import {Construction} from "@mui/icons-material"
import {LevelInfo, LevelMap} from "../../api/types"

export const TestScreen = () => {
  const {id} = useParams<{id: string}>()

  const {api} = useAuthContext()
  const navigate = useNavigate()

  const [levelInfo, setLevelInfo] = useState<LevelInfo>()
  const [fullLevel, setFullLevel] = useState<LevelMap>()

  useEffect(() => {
    if (id) {
      api.level
        .detail(id)
        .then(setLevelInfo)
        .catch(() => navigate("/levels"))
      api.level
        .levelMapDetail(id)
        .then(setFullLevel)
        .catch(() => navigate("/levels"))
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
      <TestHeader editingLevel={levelInfo} />
      <canvas style={{borderRadius: "10px"}} id="canvas"></canvas>
    </MScreen>
  )
}

export const TestHeader = (props: {editingLevel: LevelInfo | undefined}) => {
  const {editingLevel} = props
  const navigate = useNavigate()

  if (!editingLevel) {
    return <Skeleton height="40px" variant="rectangular" />
  }

  return (
    <Stack
      key="test"
      direction={"row"}
      height="64px"
      alignItems={"center"}
      gap="1rem"
    >
      <BackButton />
      <Typography
        sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}
        level="h1"
      >
        Testing {editingLevel?.name}
      </Typography>
      <div style={{flex: 1}}></div>
      <Button
        variant="outlined"
        endDecorator={<Construction />}
        onClick={() => {
          if (!editingLevel) return

          abortGame()
          navigate(`/levels/${editingLevel._id}/edit`, {replace: true})
        }}
      >
        Edit
      </Button>
    </Stack>
  )
}
