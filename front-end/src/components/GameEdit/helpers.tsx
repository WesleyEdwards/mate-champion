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
      style={{maxWidth: "4rem"}}
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
            setValue(value - incrementBy)
          }}
        >
          <Remove />
        </IconButton>
        <NumberInput roundTo={10} num={value} setNum={setValue} />

        <IconButton
          onClick={() => {
            return setValue(value + incrementBy)
          }}
        >
          <Add />
        </IconButton>
      </Stack>
    </Stack>
  )
}

export const NumberInput = ({
  num,
  setNum,
  roundTo,
  disabled = false
}: {
  num: number
  setNum: (n: number) => void
  roundTo: number
  disabled?: boolean
}) => {
  const [vString, setVString] = useState(num.toString())

  useEffect(() => {
    if (vString === "") return

    const v = +vString
    if (isNaN(v)) {
      return
    }

    const rounded = Math.ceil(v / roundTo) * roundTo
    setNum(rounded)
  }, [vString])

  useEffect(() => {
    if (num === +vString) {
      return
    }

    setVString(num.toString())
  }, [num])

  return (
    <FormControl>
      <Input
        disabled={disabled}
        value={disabled ? 0 : vString}
        onChange={(event) => {
          setVString(event.target.value)
        }}
        slotProps={{
          input: {
            component: NumericFormatAdapter
          }
        }}
      />
    </FormControl>
  )
}

export const MCSlider: FC<{
  title: string
  value: number
  setValue: (value: number) => void
  min: number
  max: number
  incrementBy?: number
}> = ({title, value, setValue: onChange, min, max, incrementBy}) => {
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
          step={incrementBy ?? 1}
          marks
          min={min}
          max={max}
          valueLabelDisplay="auto"
        />
      </Stack>
    </Stack>
  )
}
