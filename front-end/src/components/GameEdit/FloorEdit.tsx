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
import {Floor} from "../../game/entities/platform"
import {SizeControl} from "./helpers"
import {ColorPicker} from "./ColorPicker"

export const FloorEditor: FC<{
  floor: Floor
  editFloor: (p: Floor) => void
}> = ({floor, editFloor}) => {
  const Renderer = entityFC["floor"]

  return (
    <Card>
      <CardContent>
        <Renderer style={{width: "100%", marginBottom: "2rem"}} />

        <Divider />
        <SizeControl
          title="Width"
          min={20}
          setValue={(change) => {
            floor.state.dimensions[0] = change
            return editFloor(floor)
          }}
          value={floor.state.dimensions[0]}
        />
        <Divider />
      </CardContent>
    </Card>
  )
}
