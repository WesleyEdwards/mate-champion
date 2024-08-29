import {Remove, Add} from "@mui/icons-material"
import {Stack, Typography, IconButton, Slider} from "@mui/joy"
import {FC} from "react"

export const SizeControl: FC<{
  title: string
  value: number
  onChange: (value: number) => void
  min?: number
  incrementBy?: number
}> = ({title, value, onChange, incrementBy = 10, min = 0}) => {
  return (
    <Stack>
      <Typography level="body-sm">{title}</Typography>
      <Stack
        direction="row"
        px="10px"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        <IconButton
          disabled={value <= 0}
          onClick={() => {
            if (value - incrementBy < min) return -value
            onChange(Math.max(-incrementBy))
          }}
        >
          <Remove />
        </IconButton>
        <Typography>{value}</Typography>
        <IconButton onClick={() => onChange(incrementBy)}>
          <Add />
        </IconButton>
      </Stack>
    </Stack>
  )
}

export const MCSlider: FC<{
  title: string
  value: number
  setValue: (value: number) => void
  min: number
  max: number
  incrementBy?: number
}> = ({title, value, setValue: onChange, min, max}) => {
  return (
    <Stack>
      <Typography level="body-sm">{title}</Typography>
      <Stack
        direction="row"
        px="10px"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        <Slider
          aria-label="Small steps"
          defaultValue={0}
          value={value}
          getAriaValueText={(v) => {
            return `${Math.floor(v)}`
          }}
          onChange={(e, v) => {
            if (typeof v === "number") {
              onChange(v)
            }
          }}
          step={1}
          marks
          min={min}
          max={max}
          valueLabelDisplay="auto"
        />
      </Stack>
    </Stack>
  )
}
