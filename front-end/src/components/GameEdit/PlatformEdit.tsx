import {
  Stack,
  Card,
  IconButton,
  Typography,
  CardContent,
  Divider
} from "@mui/joy"
import {FC, useState} from "react"
import {entityFC} from "./ItemTypeEdit"
import {Add, Remove} from "@mui/icons-material"
import {Platform} from "../../game/entities/platform"
import {SizeControl} from "./helpers"
import {ColorPicker} from "./ColorPicker"

export const PlatformEditor: FC<{
  platform: Platform
  editPlatform: (p: Platform) => void
}> = ({platform, editPlatform}) => {
  const Renderer = entityFC["platform"]

  // const [color, setColor] = useState(platform.state.color)

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

        <Divider />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography>
            Color: <b>{platform.state.color}</b>
          </Typography>
          <ColorPicker
            color={platform.state.color}
            setColor={(newColor) => {
              platform.state.color = newColor
              return editPlatform(platform)
            }}
            buttonLabel="Change"
          />
        </Stack>
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
