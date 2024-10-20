import {Remove, Add} from "@mui/icons-material"
import {
  Stack,
  Typography,
  IconButton,
  Slider,
  Input,
  FormControl,
  FormLabel
} from "@mui/joy"
import {FC, forwardRef, useEffect, useState} from "react"
import {NumericFormat, NumericFormatProps} from "react-number-format"
import {toRounded} from "../../game/editor/editHelpers"

const NumericFormatAdapter = forwardRef<
  NumericFormatProps,
  {
    onChange: (event: {target: {name: string; value: string}}) => void
    name: string
  }
>(function NumericFormatAdapter(props, ref) {
  const {onChange, ...other} = props

  return (
    <NumericFormat
      {...other}
      style={{width: "5rem"}}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value
          }
        })
      }}
      thousandSeparator
      valueIsNumericString
    />
  )
})
export const SizeControl: FC<{
  title: string
  value: number
  setValue: (value: number) => void
  min?: number
  incrementBy?: number
}> = ({title, setValue, value, incrementBy = 10, min = 0}) => {
  const [vString, setVString] = useState(value.toString())

  useEffect(() => {
    if (vString === "") return

    const v = +vString
    if (isNaN(v)) {
      return
    }

    const roundTo = 10
    const rounded = Math.ceil(v / roundTo) * roundTo

    setValue(rounded)
  }, [vString])

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
            setVString((value + incrementBy).toString())
            setValue(value - incrementBy)
          }}
        >
          <Remove />
        </IconButton>

        <FormControl>
          <Input
            value={vString}
            onChange={(event) => {
              setVString(event.target.value)
            }}
            placeholder="title"
            slotProps={{
              input: {
                component: NumericFormatAdapter
              }
            }}
          />
        </FormControl>
        <IconButton
          onClick={() => {
            setVString((value + incrementBy).toString())
            return setValue(value + incrementBy)
          }}
        >
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
