import {
  Button,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Typography
} from "@mui/joy"
import {ArrowBack, Construction} from "@mui/icons-material"
import {FC} from "react"
import {useLevelContext} from "../hooks/useLevels"
import {CreateNewLevel} from "./CreateNewLevel"
import {useAuthContext} from "../hooks/useAuth"
import {gameLoopEdit} from "../game/editor/gameLoopEdit"
import {LevelMap} from "../api/serverModels"
import {abortGame} from "../game/editor/eventListeners"
import {useNavigate} from "react-router-dom"

export const LevelsHeader: FC = () => {
  const navigate = useNavigate()
  return (
    <Stack width="100%" gap="0.75rem" mb="1rem">
      <Stack direction="row" justifyContent="space-between">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <Typography level="h2">Levels</Typography>
        <CreateNewLevel />
      </Stack>
      <Divider />
    </Stack>
  )
}

export const BackButton = () => {
  const navigate = useNavigate()
  return (
    <IconButton
      sx={{display: "absolute"}}
      onClick={() => {
        // abortGame()
        navigate(-1)
      }}
    >
      <ArrowBack />
    </IconButton>
  )
}

export const PlayHeader: FC = () => {
  return (
    <Stack direction={"row"} height="64px" alignItems={"center"}>
      <BackButton />
      <Typography
        sx={{
          marginInline: "auto"
        }}
        level="h1"
      >
        Mate Champion🧉
      </Typography>
    </Stack>
  )
}

// export const TestHeader = () => {
//   const {editingLevel, updateLevelMap} = useLevelContext()
//   const {api} = useAuthContext()
//   const navigate = useNavigate()

//   if (editingLevel === "loading") {
//     return <Skeleton height="40px" variant="rectangular" />
//   }

//   return (
//     <Stack direction={"row"} height="64px" alignItems={"center"} gap="1rem">
//       <BackButton />
//       <Typography
//         sx={{
//           whiteSpace: "nowrap",
//           overflow: "hidden",
//           textOverflow: "ellipsis"
//         }}
//         level="h1"
//       >
//         Testing {editingLevel?.name}
//       </Typography>
//       <div style={{flex: 1}}></div>
//       <Button
//         variant="outlined"
//         endDecorator={<Construction />}
//         onClick={() => {
//           if (!editingLevel) return

//           abortGame()
//           navigate("/edit")

//           api.level.levelMapDetail(editingLevel._id).then((level) => {
//             setTimeout(() => {
//               gameLoopEdit({
//                 level,
//                 modifyLevel: (level: Partial<LevelMap>) => {
//                   updateLevelMap(level)
//                 }
//               })
//             }, 100)
//           })
//         }}
//       >
//         Edit
//       </Button>
//     </Stack>
//   )
// }

export const ViewHeaderSubScreen = ({title}: {title: string}) => {
  const navigate = useNavigate()
  return (
    <Stack width="100%" gap="0.75rem" mb="1rem">
      <Stack direction="row" justifyContent="space-between">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <Typography level="h2">{title}</Typography>
        <div style={{width: "2rem"}}></div>
      </Stack>
      <Divider />
    </Stack>
  )
}
