import {Card, CardContent} from "@mui/joy"
import {FC} from "react"
import {Platform} from "../../game/entities/platform"

export const PlatformEditor: FC<{
  platform: Platform
  editPlatform: (p: Platform) => void
}> = ({platform, editPlatform}) => {
  return (
    <Card>
      <CardContent>
        <div
          style={{
            height: "30px",
            borderColor: "black",
            borderWidth: "3px",
            borderStyle: "solid",
            backgroundColor: platform.color,
            width: "100%",
            marginBottom: "2rem"
          }}
        ></div>
      </CardContent>
    </Card>
  )
}
