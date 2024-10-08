import {FC, useState} from "react"
import {Button, Input} from "@mui/joy"
import {Add} from "@mui/icons-material"
import {useAuthContext} from "../hooks/useAuth"
import {useLevelContext} from "../hooks/useLevels"
import {useNavigator} from "../hooks/UseNavigator"
import {MCModal} from "./MCModal"

export const CreateNewLevel: FC = () => {
  const {user} = useAuthContext()
  const {setEditingLevel, levelCache} = useLevelContext()
  const {navigateTo} = useNavigator()

  const [creating, setCreating] = useState(false)

  const [makingNew, setMakingNew] = useState<string>()

  const createLevel = async (name: string) => {
    const createdLevel = await levelCache.update.create({
      _id: crypto.randomUUID(),
      owner: user?._id ?? "",
      description: null,
      creatorName: user?.name ?? "",
      public: false,
      name: name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    setEditingLevel(createdLevel._id)
  }

  return (
    <>
      <Button
        onClick={() => {
          setMakingNew("")
        }}
        loading={creating}
        endDecorator={<Add />}
      >
        Create
      </Button>

      <MCModal
        title={"New Level"}
        open={makingNew !== undefined}
        onClose={() => setMakingNew(undefined)}
        onConfirm={() => {
          setCreating(true)
          createLevel(makingNew ?? "").then(() => {
            setCreating(false)
            navigateTo("editorDetail")
          })
        }}
        disableConfirm={!makingNew}
        confirmLabel="Create"
      >
        <Input
          value={makingNew}
          onChange={(e) => setMakingNew(e.target.value)}
          placeholder="My level"
        />
      </MCModal>
    </>
  )
}
