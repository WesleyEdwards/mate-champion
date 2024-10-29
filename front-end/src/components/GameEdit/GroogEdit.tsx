import {
  Card,
  CardContent,
  Select,
  Stack,
  Option,
  Typography,
  FormControl,
  Checkbox
} from "@mui/joy"
import {FC} from "react"
import {entityFC} from "./ItemTypeEdit"
import {Groog, groogConst} from "../../game/entities/groog"
import {MCSlider, NumberInput, SizeControl} from "./helpers"

export const GroogEdit: FC<{
  groog: Groog
  editGroog: (g: Groog) => void
}> = ({groog, editGroog}) => {
  const Renderer = entityFC["groog"]

  const facing = groog.state.velocity[0] > 0 ? "right" : "left"

  return (
    <Card>
      <CardContent>
        <Renderer
          style={{
            width: "100%",
            marginBottom: "1rem"
          }}
        />

        <Stack direction="row" gap="1rem" alignItems="center">
          <Typography>Facing: </Typography>

          <Select
            defaultValue={facing}
            onChange={(e, value) => {
              const abs = Math.abs(groog.state.velocity[0])
              if (value === "left") {
                groog.state.velocity[0] = -abs
              } else {
                groog.state.velocity[0] = abs
              }
              editGroog(groog)
            }}
          >
            <Option value="left">Left</Option>
            <Option value="right">Right</Option>
          </Select>
        </Stack>

        <MCSlider
          title="Speed"
          setValue={(value) => {
            const accountForDir = groog.state.velocity[0] > 0 ? value : -value
            groog.state.velocity[0] = accountForDir / 100
            return editGroog(groog)
          }}
          value={Math.abs(Math.floor(groog.state.velocity[0] * 100))}
          incrementBy={5}
          min={0}
          max={100}
        />

        <Stack direction="row" alignItems="center" gap="10px">
          <Typography>Jump every:</Typography>
          <NumberInput
            roundTo={0.25}
            disabled={
              groog.state.timeBetweenJump === groogConst.noJumpFrequency
            }
            num={groog.state.timeBetweenJump / 1000}
            setNum={(n) => {
              groog.state.timeBetweenJump = n * 1000
              return editGroog(groog)
            }}
          />
          <Typography>s</Typography>
        </Stack>
        <FormControl>
          <Checkbox
            label="Don't jump"
            checked={groog.state.timeBetweenJump === groogConst.noJumpFrequency}
            sx={{alignSelf: "end", m: 1}}
            onChange={(e) => {
              const p = e.target.checked
              if (p) {
                groog.state.timeBetweenJump = groogConst.noJumpFrequency
              } else {
                groog.state.timeBetweenJump = 3000
              }
              return editGroog(groog)
            }}
          />
        </FormControl>
        <Stack direction="row" alignItems="center" gap="10px">
          <Typography>Turn every:</Typography>
          <NumberInput
            roundTo={0.25}
            num={
              groog.state.timeBetweenTurn === groogConst.noJumpFrequency
                ? 0
                : groog.state.timeBetweenTurn === groogConst.minJumpFrequency
                  ? 0
                  : groog.state.timeBetweenTurn / 1000
            }
            setNum={(n) => {
              const actual = n === 0 ? groogConst.minJumpFrequency / 1000 : n
              groog.state.timeBetweenTurn = actual * 1000
              return editGroog(groog)
            }}
          />
          <Typography>s</Typography>
        </Stack>
      </CardContent>
    </Card>
  )
}
