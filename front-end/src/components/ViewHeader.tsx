import {Divider, IconButton, Stack, Typography} from "@mui/joy"
import {ArrowBack} from "@mui/icons-material"
import {FC} from "react"
import {CreateNewLevel} from "./CreateNewLevel"
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
