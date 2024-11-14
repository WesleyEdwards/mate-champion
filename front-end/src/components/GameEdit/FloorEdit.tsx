import {
  Stack,
  Card,
  IconButton,
  Typography,
  CardContent,
  Divider
} from "@mui/joy"
import {FC, useState} from "react"
import platformImg from "../../assets/platform.png"
import {Floor} from "../../game/entities/platform"
import {SizeControl} from "./helpers"

export const FloorEditor: FC<{
  floor: Floor
  editFloor: (p: Floor) => void
}> = ({floor, editFloor}) => {
  return (
    <Card>
      <CardContent>
        <img
          src={platformImg}
          style={{marginBottom: "2rem", width: "60px", height: "30px"}}
        />

        <Divider />
        <SizeControl
          title="Width"
          min={20}
          setValue={(change) => {
            floor.dimensions[0] = change
            return editFloor(floor)
          }}
          value={floor.dimensions[0]}
        />
        <Divider />
      </CardContent>
    </Card>
  )
}
