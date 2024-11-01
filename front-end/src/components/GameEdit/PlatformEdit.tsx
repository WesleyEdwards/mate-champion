import {Stack, Card, Typography, CardContent, Divider} from "@mui/joy"
import {FC} from "react"
import {entityFC} from "./ItemTypeEdit"
import {Platform} from "../../game/entities/platform"
import {SizeControl} from "./helpers"
import {ColorPicker} from "./ColorPicker"

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
            backgroundColor: platform.color,
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
            Color: <b>{platform.color}</b>
          </Typography>
          <ColorPicker
            disabled={false}
            color={platform.color}
            setColor={(newColor) => {
              platform.color = newColor
              return editPlatform(platform)
            }}
            buttonLabel="Change"
          />
        </Stack>
        <SizeControl
          title="Width"
          min={20}
          setValue={(change) => {
            platform.dimensions[0] = change
            return editPlatform(platform)
          }}
          value={platform.width}
        />
        <Divider />
        <SizeControl
          title="Height"
          min={20}
          setValue={(change) => {
            platform.dimensions[1] = change
            return editPlatform(platform)
          }}
          value={platform.height}
        />
      </CardContent>
    </Card>
  )
}
