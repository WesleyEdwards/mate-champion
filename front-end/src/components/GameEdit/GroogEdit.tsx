import {
  Card,
  CardContent,
  Select,
  Stack,
  Option,
  Typography,
  Divider,
  FormHelperText
} from "@mui/joy"
import {FC} from "react"
import grogImg from "../../assets/grog/enemy_walking_single.png"
import {Groog, groogConst} from "../../game/entities/groog"
import {MCSlider, NumberInput, SizeControl} from "./helpers"
import {TimedEvent} from "../../api/serverModels"

export const GroogEdit: FC<{
  groog: Groog
  editGroog: (g: Groog) => void
}> = ({groog, editGroog}) => {
  const facing = groog.velocity[0] > 0 ? "right" : "left"

  return (
    <Card>
      <CardContent>
        <img
          src={grogImg}
          style={{
            maxWidth: "50px",
            maxHeight: "50px",
            position: "absolute",
            marginInline: "190px"
          }}
        />
        <Typography level="title-lg">Facing</Typography>
        <Stack direction="row" gap="1rem" alignItems="center">
          <Select
            defaultValue={facing}
            onChange={(e, value) => {
              const abs = Math.abs(groog.velocity[0])
              if (value === "left") {
                groog.velocity[0] = -abs
              } else {
                groog.velocity[0] = abs
              }
              editGroog(groog)
            }}
          >
            <Option value="left">Left</Option>
            <Option value="right">Right</Option>
          </Select>
        </Stack>

        {/* <Divider sx={{m: 3}} /> */}
        <div style={{height: "1rem"}}></div>

        <MCSlider
          title="Speed"
          setValue={(value) => {
            const accountForDir = groog.velocity[0] > 0 ? value : -value
            groog.velocity[0] = accountForDir / 100
            return editGroog(groog)
          }}
          value={Math.abs(Math.floor(groog.velocity[0] * 100))}
          incrementBy={5}
          min={0}
          max={100}
        />

        {/* <Divider sx={{m: 3}} /> */}
        <div style={{height: "1rem"}}></div>

        <TimedEventEditor
          timedEvent={groog.state.timeBetweenJump}
          onChange={(value) => {
            groog.state.timeBetweenJump = {
              ...groog.state.timeBetweenJump,
              ...value
            }
            editGroog(groog)
          }}
          labels={{
            title: "Jump behavior",
            frequencyDescription: {
              Time: `Jump every ${(groog.state.timeBetweenJump.time / 1000).toFixed(0)} s`,
              Random: "Jump at a random interval",
              None: "Don't jump"
            }[groog.state.timeBetweenJump.type]
          }}
        />

        {/* <Divider sx={{m: 3}} /> */}
        <div style={{height: "1rem"}}></div>

        <TimedEventEditor
          timedEvent={groog.state.timeBetweenTurn}
          onChange={(value) => {
            groog.state.timeBetweenTurn = {
              ...groog.state.timeBetweenTurn,
              ...value
            }
            editGroog(groog)
          }}
          labels={{
            title: "Turn behavior",
            frequencyDescription: {
              Time: `Turn every ${(groog.state.timeBetweenTurn.time / 1000).toFixed(0)} s`,
              Random: "Turn at a random interval",
              None: "Don't Turn"
            }[groog.state.timeBetweenTurn.type]
          }}
        />
      </CardContent>
    </Card>
  )
}

const TimedEventEditor = ({
  timedEvent,
  onChange,
  labels
}: {
  timedEvent: TimedEvent
  onChange: (c: Partial<TimedEvent>) => void
  labels: {
    title: string
    frequencyDescription: string
  }
}) => {
  return (
    <>
      <Typography level="title-lg">{labels.title}</Typography>

      <Stack direction="row" gap="5px" alignItems={"center"}>
        <Select
          sx={{width: "10rem"}}
          defaultValue={timedEvent.type}
          onChange={(_, value) => {
            if (value) {
              onChange({type: value})
            }
          }}
        >
          <Option value="Time">Timed</Option>
          <Option value="Random">Random</Option>
          <Option value="None">None</Option>
        </Select>
        <NumberInput
          roundTo={0.25}
          disabled={timedEvent.type !== "Time"}
          num={timedEvent.time / 1000}
          setNum={(n) => {
            onChange({time: n * 1000})
          }}
        />
        <Typography>s</Typography>
      </Stack>
      <FormHelperText>{labels.frequencyDescription}</FormHelperText>
    </>
  )
}
