import {FC, useState} from "react"
import {Button, Input} from "@mui/joy"
import {Add} from "@mui/icons-material"
import {useAuthContext} from "../hooks/useAuth"
import {MCModal} from "./MCModal"
import {useNavigate} from "react-router-dom"

export const CreateNewLevel: FC<{text?: string}> = ({text = "Create"}) => {
  const {user, api} = useAuthContext()
  const navigate = useNavigate()

  const [makingNew, setMakingNew] = useState<string>()

  const createLevel = async (name: string) => {
    const createdLevel = await api.level.create({
      _id: crypto.randomUUID(),
      owner: user?._id ?? "",
      description: null,
      creatorName: user?.name ?? "",
      public: false,
      name: name
    })
    navigate(`/levels/${createdLevel._id}`)
  }

  return (
    <>
      <Button
        onClick={() => {
          setMakingNew("")
        }}
        sx={{
          maxWidth: "12rem",
          alignSelf: "center",
          backgroundColor: "#0b6bcb",
          "&:hover": {
            backgroundColor: "#084989"
          }
        }}
        endDecorator={<Add />}
      >
        {text}
      </Button>

      <MCModal
        title={"Level Name"}
        open={makingNew !== undefined}
        onClose={() => setMakingNew(undefined)}
        onConfirm={() => {
          createLevel(makingNew ?? "").then(() => {
            navigate("/editorDetail")
          })
        }}
        disableConfirm={!makingNew}
        confirmLabel="Create"
      >
        <Input
          autoFocus
          value={makingNew}
          onChange={(e) => setMakingNew(e.target.value)}
          placeholder="My level"
        />
      </MCModal>
    </>
  )
}
