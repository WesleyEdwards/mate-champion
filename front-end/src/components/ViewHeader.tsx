import {Divider, IconButton, Stack, Typography} from "@mui/joy"
import {ArrowBack} from "@mui/icons-material"
import {FC} from "react"
import {CreateNewLevel} from "./CreateNewLevel"
import {useNavigateBack} from "../hooks/useSafeGoBack"

export const LevelsHeader: FC = () => {
  const navigateBack = useNavigateBack()
  return (
    <Stack width="100%" gap="0.75rem" mb="1rem">
      <Stack direction="row" justifyContent="space-between">
        <IconButton
          onClick={() => {
            navigateBack()
          }}
        >
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
  const navigateBack = useNavigateBack()
  return (
    <IconButton
      sx={{display: "absolute"}}
      onClick={() => {
        navigateBack()
      }}
    >
      <ArrowBack />
    </IconButton>
  )
}

export const ViewHeaderSubScreen = ({title}: {title: string}) => {
  const navigateBack = useNavigateBack()
  return (
    <Stack width="100%" gap="0.75rem" mb="1rem">
      <Stack direction="row" justifyContent="space-between">
        <IconButton
          onClick={() => {
            navigateBack()
          }}
        >
          <ArrowBack />
        </IconButton>
        <Typography level="h2">{title}</Typography>
        <div style={{width: "2rem"}}></div>
      </Stack>
      <Divider />
    </Stack>
  )
}
