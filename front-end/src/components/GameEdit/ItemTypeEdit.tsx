import {Stack, Card, Typography} from "@mui/joy"
import {Adding} from "./CourseBuilderSettings"
import grogImg from "../../assets/grog/enemy_walking_single.png"
import packageImg from "../../assets/mate-package.png"
import platformImg from "../../assets/platform.png"
import {capitalize} from "lodash"
import {ColorPicker} from "./ColorPicker"
import {camelCaseToTitleCase} from "../../helpers"
import {getGlobalEditing, setGlobalEditing} from "../../game/editor/editHelpers"

export const AddingEntity = ({
  edit,
  setEdit
}: {
  edit: Adding
  setEdit: React.Dispatch<React.SetStateAction<Adding>>
}) => {
  const handleSetEditingItem = (params: Partial<Adding>) => {
    setGlobalEditing("addingEntity", {
      ...getGlobalEditing().addingEntity,
      ...params
    })
    setEdit((prev) => ({...prev, ...params}))
  }

  if (!edit.type) return null

  const disabled = location.pathname.includes("test")

  return (
    <Card style={{padding: "12px"}}>
      <Stack>
        <Stack direction="row" justifyContent="space-between">
          <Stack
            display="flex"
            flexWrap={"wrap"}
            flexDirection={"row"}
            alignSelf="center"
          >
            {(["platform", "floor", "groog", "ammo"] as const).map((k) => (
              <Card
                variant={edit.type === k ? "solid" : "soft"}
                key={k}
                onClick={() => {
                  handleSetEditingItem({type: k})
                }}
                sx={{
                  width: "100px",
                  height: "100px",
                  p: "0px",
                  m: "8px",
                  ":hover": {
                    cursor: "pointer"
                  }
                }}
              >
                <Stack
                  justifyContent={"space-between"}
                  height={"100%"}
                  p="8px"
                  alignItems={"center"}
                >
                  {
                    {
                      platform: (
                        <div
                          style={{
                            width: "60px",
                            height: "30px",
                            backgroundColor:
                              getGlobalEditing().addingEntity.color ??
                              "springgreen",
                            borderColor: "black",
                            borderWidth: "3px",
                            borderStyle: "solid"
                          }}
                        ></div>
                      ),
                      floor: (
                        <img
                          src={platformImg}
                          style={{width: "60px", height: "30px"}}
                        />
                      ),
                      groog: (
                        <img
                          style={{maxWidth: "70px", maxHeight: "70px"}}
                          src={grogImg}
                        />
                      ),
                      ammo: (
                        <img
                          style={{maxWidth: "50px", maxHeight: "50px"}}
                          src={packageImg}
                        />
                      )
                    }[k]
                  }
                  <Typography textAlign="center">
                    {camelCaseToTitleCase(k)}
                  </Typography>
                </Stack>
              </Card>
            ))}
            <Typography level="body-sm">
              Ctrl+Click to add a{edit.type === "ammo" ? "n" : ""}{" "}
              {capitalize(edit.type)}.
            </Typography>
          </Stack>
        </Stack>
        {edit.type === "platform" && (
          <Stack margin="1rem" direction={"row"}>
            <ColorPicker
              disabled={disabled}
              color={edit.color || "springgreen"}
              setColor={(color) => {
                handleSetEditingItem({baseColor: color})
              }}
              buttonLabel="Color"
            />
          </Stack>
        )}
      </Stack>
    </Card>
  )
}
