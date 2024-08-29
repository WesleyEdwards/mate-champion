import {
  Stack,
  Card,
  IconButton,
  Typography,
  CardContent,
  Divider
} from "@mui/joy"
import {FC} from "react"
import {entityFC} from "./ItemTypeEdit"
import {Add, Remove} from "@mui/icons-material"
import {Platform} from "../../game/entities/platform"
import {SizeControl} from "./helpers"

export const PlatformEditor: FC<{
  platform: Platform
  editPlatform: (p: Platform) => void
}> = ({platform, editPlatform}) => {
  const Renderer = entityFC["platform"]
  return (
    <Card>
      <CardContent>
        <Renderer
          style={{
            backgroundColor: platform.state.color,
            width: "100%",
            marginBottom: "2rem"
          }}
        />
        <SizeControl
          title="Width"
          onChange={(change) => {
            platform.state.dimensions[0] += change
            return editPlatform(platform)
          }}
          value={platform.state.dimensions[0]}
        />
        <Divider />
        <SizeControl
          title="Height"
          onChange={(change) => {
            platform.state.dimensions[1] += change
            return editPlatform(platform)
          }}
          value={platform.state.dimensions[1]}
        />
      </CardContent>
    </Card>
  )
}
