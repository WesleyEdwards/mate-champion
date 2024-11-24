import {CircularProgress, Stack} from "@mui/joy"
import {useState, useEffect, FC} from "react"
import {EntityType} from "../../game/entities/entityTypes"
import {useLevelContext} from "../../hooks/useLevels"
import {AddingEntity} from "./ItemTypeEdit"
import {Floor, Platform} from "../../game/entities/platform"
import {PlatformEditor} from "./PlatformEdit"
import {scrollbarProps} from "../LevelEditorHome"
import {GroogEdit} from "./GroogEdit"
import {Groog} from "../../game/entities/groog"
import {FloorEditor} from "./FloorEdit"
import {Entity} from "../../game/entities/Entity"
import {getGlobalEditing} from "../../game/editor/editHelpers"

export type EditableEntity = Exclude<EntityType, "player" | "bullet">

export type AddableEntity = Exclude<EntityType, "player" | "bullet" | "endGate">

export type Adding = {
  type: AddableEntity | undefined
  baseColor: string | undefined
  color: string | undefined
}

export const CourseBuilderSettings = () => {
  const {editingLevel} = useLevelContext()
  const [adding, setAdding] = useState<Adding>({
    type: undefined,
    color: undefined,
    baseColor: undefined
  })
  const [editingEntities, setEditingEntities] = useState<Entity[]>([])

  const updateEditing = () => {
    const adding = getGlobalEditing().addingEntity
    if (
      adding.type !== adding.type ||
      adding.color !== adding.baseColor ||
      adding.color !== adding.color
    ) {
      setAdding({...adding})
    }
    const editing = getGlobalEditing().editingEntities
    if (!arraysAreSame(editingEntities, editing)) {
      setEditingEntities([...editing])
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      updateEditing()
    }, 100)
    return () => clearInterval(interval)
  })

  if (editingLevel === "loading" || editingLevel === undefined) {
    return <CircularProgress />
  }

  return (
    <Stack gap="2rem">
      <AddingEntity edit={adding} setEdit={setAdding} />
      <EditingEntities edit={editingEntities} setEdit={setEditingEntities} />
    </Stack>
  )
}

export const EditingEntities: FC<{
  edit: Entity[]
  setEdit: React.Dispatch<React.SetStateAction<Entity[]>>
}> = ({edit, setEdit}) => {
  return (
    <Stack
      gap="8px"
      sx={{
        height: "100%",
        maxHeight: "500px",
        overflowY: "auto",
        ...scrollbarProps
      }}
    >
      {edit.map((entity) => {
        if (entity instanceof Platform) {
          return (
            <PlatformEditor
              key={entity.id}
              platform={entity}
              editPlatform={(p) => {
                setEdit((prev) => prev.map((e) => (e.id === p.id ? p : e)))
              }}
            />
          )
        }
        if (entity instanceof Groog) {
          return (
            <GroogEdit
              key={entity.id}
              groog={entity}
              editGroog={(p) => {
                setEdit((prev) => prev.map((e) => (e.id === p.id ? p : e)))
              }}
            />
          )
        }
        if (entity instanceof Floor) {
          return (
            <FloorEditor
              key={entity.id}
              floor={entity}
              editFloor={(p) => {
                setEdit((prev) => prev.map((e) => (e.id === p.id ? p : e)))
              }}
            />
          )
        }
        return <div key={entity.id}>{entity.typeId}</div>
      })}
    </Stack>
  )
}

export const arraysAreSame = (a: Entity[], b: Entity[]) =>
  a.every((e) => b.find((entity) => entity.id === e.id)) &&
  b.every((e) => a.find((entity) => entity.id === e.id))
