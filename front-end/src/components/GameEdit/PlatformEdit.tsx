import {Stack, Card, Typography, CardContent, Divider} from "@mui/joy"
import {FC} from "react"
import {entityFC} from "./ItemTypeEdit"
import {Platform} from "../../game/entities/platform"

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

        {/* <Divider />
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
        </Stack> */}
      </CardContent>
    </Card>
  )
}
