import {Undo, Check, Edit} from "@mui/icons-material"
import {Stack, Typography, Input, IconButton} from "@mui/joy"
import {FC, useState} from "react"
import {useAuthContext} from "../hooks/useAuth"
import {camelCaseToTitleCase} from "../helpers"

export const EditField = ({
  init,
  label,
  handleChange
}: {
  init: string
  label: string
  handleChange: (s: string) => void
}) => {
  const [field, setField] = useState<string>(init)
  const [editing, setEditing] = useState<boolean>(false)

  if (editing) {
    return (
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack direction="column" alignItems="center">
          <Input
            value={field}
            sx={{minWidth: "24rem"}}
            onChange={(e) => setField(e.target.value)}
          />
          <Typography level="body-sm" alignSelf={"flex-start"}>
            {label}
          </Typography>
        </Stack>

        <Stack direction="row" gap="1rem">
          <IconButton
            onClick={() => {
              setEditing(false)
              setField(init)
            }}
          >
            <Undo />
          </IconButton>
          <IconButton
            onClick={() => {
              setEditing(false)
              if (init !== field) handleChange(field)
            }}
          >
            <Check />
          </IconButton>
        </Stack>
      </Stack>
    )
  }
  return (
    <Stack
      direction="row"
      // height="40px"
      justifyContent="space-between"
      alignItems="center"
    >
      <Stack direction="column" alignItems="center">
        <Typography sx={{height: "40px"}} level="h4">
          {init}
        </Typography>
        <Typography level="body-sm" alignSelf={"flex-start"}>
          {label}
        </Typography>
      </Stack>

      <IconButton onClick={() => setEditing(true)}>
        <Edit />
      </IconButton>
    </Stack>
  )
}
