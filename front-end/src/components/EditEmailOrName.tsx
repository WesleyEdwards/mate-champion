import {Undo, Check, Edit} from "@mui/icons-material"
import {Stack, Typography, Input, IconButton} from "@mui/joy"
import {FC, useState} from "react"
import {useAuthContext} from "../hooks/useAuth"
import {camelCaseToTitleCase} from "../helpers"

export const EditName: FC = () => {
  const {user, api, modifyUser} = useAuthContext()
  if (!user) {
    throw new Error("This component requires the user to not be null")
  }
  const [displayName, setDisplayName] = useState<string>(user.name)
  const [editing, setEditing] = useState<boolean>(false)

  return (
    <Stack
      direction="row"
      height="40px"
      justifyContent="space-between"
      alignItems="center"
    >
      <Stack direction="column" alignItems="center">
        {editing ? (
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        ) : (
          <Typography level="h4">{user.name}</Typography>
        )}

        <Typography level="body-sm" alignSelf={"flex-start"}>
          Name
        </Typography>
      </Stack>
      {editing ? (
        <Stack direction="row" gap="1rem">
          <IconButton
            onClick={() => {
              setEditing(false)
              setDisplayName(user.name)
            }}
          >
            <Undo />
          </IconButton>
          <IconButton
            onClick={() => {
              setEditing(false)
              if (displayName !== user.name) {
                modifyUser({name: displayName})
                api.user.modify(user._id, {name: displayName})
              }
            }}
          >
            <Check />
          </IconButton>
        </Stack>
      ) : (
        <IconButton onClick={() => setEditing(true)}>
          <Edit />
        </IconButton>
      )}
    </Stack>
  )
}

export const EditEmail: FC = () => {
  const {user, api, modifyUser} = useAuthContext()
  if (!user) {
    throw new Error("This component requires the user to not be null")
  }
  const [displayEmail, setDisplayEmail] = useState<string>(user.email ?? "")
  const [editing, setEditing] = useState<boolean>(false)

  return (
    <Stack
      direction="row"
      height="40px"
      justifyContent="space-between"
      alignItems="center"
    >
      <Stack direction="column" alignItems="center">
        {editing ? (
          <Input
            sx={{height: "40px"}}
            value={displayEmail}
            onChange={(e) => setDisplayEmail(e.target.value)}
          />
        ) : (
          <Typography sx={{height: "40px"}} level="h4">
            {user.email}
          </Typography>
        )}
        <Typography level="body-sm" alignSelf={"flex-start"}>
          Email
        </Typography>
      </Stack>

      {editing ? (
        <Stack direction="row" gap="1rem">
          <IconButton
            onClick={() => {
              setEditing(false)
              setDisplayEmail(user.email ?? "")
            }}
          >
            <Undo />
          </IconButton>
          <IconButton
            onClick={() => {
              setEditing(false)
              if (displayEmail !== user.email) {
                modifyUser({email: displayEmail})
                api.user.modify(user._id, {email: displayEmail})
              }
            }}
          >
            <Check />
          </IconButton>
        </Stack>
      ) : (
        <IconButton onClick={() => setEditing(true)}>
          <Edit />
        </IconButton>
      )}
    </Stack>
  )
}
