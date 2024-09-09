import {Stack, Card, Typography, Option, Select} from "@mui/joy"
import {AddableEntity, Adding} from "./CourseBuilderSettings"
import grogImg from "../../assets/grog/enemy_walking_single.png"
import packageImg from "../../assets/mate-package.png"
import platformImg from "../../assets/platform.png"
import {FC} from "react"
import {capitalize} from "lodash"
import {ColorPicker} from "./ColorPicker"

export const AddingEntity = ({
  edit,
  setEdit
}: {
  edit: Adding
  setEdit: React.Dispatch<React.SetStateAction<Adding>>
}) => {
  const handleSetEditingItem = (params: Partial<Adding>) => {
    window.addingEntity = {...window.addingEntity, ...params}
    setEdit((prev) => ({...prev, ...params}))
  }

  if (!edit.type) return null

  const Render = entityFC[edit.type]

  return (
    <Card style={{padding: "12px"}}>
      <Stack>
        <Stack direction="row" justifyContent="space-between">
          <Stack>
            <Select
              sx={{mb: "5px"}}
              defaultValue={"platform" as const}
              value={edit.type}
              onChange={(_, value) => {
                if (value) {
                  handleSetEditingItem({type: value})
                }
              }}
              renderValue={(k) => (
                <Typography level="title-lg">
                  {capitalize(k?.value ?? "platform")}
                </Typography>
              )}
            >
              {Object.keys(entityFC).map((k) => (
                <Option value={k} key={k}>
                  <Typography level="title-lg">{capitalize(k)}</Typography>
                </Option>
              ))}
            </Select>
            <Typography level="body-xs">
              Ctrl + Click to add a{edit.type === "ammo" ? "n" : ""}{" "}
              {capitalize(edit.type)}.
            </Typography>
          </Stack>
        </Stack>
        <Stack
          direction="row"
          alignItems={"center"}
          justifyContent={"space-between"}
          minHeight={"6rem"}
        >
          <Render
            style={{
              backgroundColor: edit.type === "platform" ? edit.color : undefined
            }}
          />
          {edit.type === "platform" && (
            <Stack margin="1rem" direction={"row"}>
              <ColorPicker
                color={edit.color}
                setColor={(color) => handleSetEditingItem({color})}
                buttonLabel="Color"
              />
            </Stack>
          )}
        </Stack>
      </Stack>
    </Card>
  )
}

export const entityFC: Record<
  AddableEntity,
  FC<{style?: React.CSSProperties | undefined}>
> = {
  platform: ({style}) => (
    <div
      style={{
        width: "60px",
        height: "30px",
        backgroundColor: "springgreen",
        borderColor: "black",
        borderWidth: "3px",
        borderStyle: "solid",
        ...style
      }}
    ></div>
  ),
  floor: ({style}) => (
    <img src={platformImg} style={{...style, width: "60px", height: "30px"}} />
  ),
  groog: ({style}) => (
    <img
      style={{
        ...style,
        maxWidth: "50px",
        maxHeight: "50px"
      }}
      src={grogImg}
    />
  ),
  ammo: ({style}) => (
    <img
      style={{...style, maxWidth: "30px", maxHeight: "30px"}}
      src={packageImg}
    />
  )
}
