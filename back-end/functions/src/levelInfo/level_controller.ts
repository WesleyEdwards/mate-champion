import {controller} from "../simpleServer/controller"
import {importLevels} from "./levelQueries"
import {Infer} from "../types"
import {BuilderParams} from "../simpleServer/requestBuilders"
import {JWTBody} from "../auth/authTypes"
import {isValid} from "../simpleServer/request_body"
import {User} from "../user/user_controller"
import {createDbObject} from "../simpleServer/validation"
import {createBasicMCEndpoints} from "../controllers/serverBuilders"
import {HasId} from "../simpleServer/DbClient"

export const levelSchema = createDbObject((z) =>
  z.object({
    owner: z.string(),
    public: z.boolean().default(false),
    name: z.string(),
    description: z.string().nullable().default(null),
    creatorName: z.string().default("")
  })
)

export type LevelInfo = Infer<typeof levelSchema>

const levelBaseEndpoints = createBasicMCEndpoints<LevelInfo>({
  validator: levelSchema,
  endpoint: (db) => db.level,
  perms: {
    read: ifNotAdmin<LevelInfo>((jwtBody) => ({
      owner: {Equal: jwtBody?.userId ?? ""}
    })),
    delete: ifNotAdmin<LevelInfo>((jwtBody) => ({
      owner: {Equal: jwtBody?.userId ?? ""}
    })),
    create: ifNotAdmin<LevelInfo>((jwtBody) => ({
      owner: {Equal: jwtBody?.userId ?? ""}
    })),
    modify: ifNotAdmin<LevelInfo>((jwtBody) => ({
      owner: {Equal: jwtBody?.userId ?? ""}
    }))
  },
  actions: {
    postDelete: async (item, {db}) => {
      await db.levelMap.deleteOne(item._id)
    },
    preCreate: async (item, {db}) => {
      const user = await db.user.findOne({_id: {Equal: item.owner}})
      if (!isValid<User>(user)) throw new Error("User not found")
      return {...item, creatorName: user.name} satisfies LevelInfo
    },
    postCreate: async (level, {db}) => {
      await db.levelMap.insertOne({
        champInitPos: [400, 400],
        _id: level._id,
        endPosition: 4500,
        packages: [],
        groog: [],
        platformColor: "springgreen",
        floors: [{x: -500, width: 7000, color: "green"}],
        platforms: []
      })
    }
  }
})

export function ifNotAdmin<T extends HasId>(
  fun: BuilderParams<T, any>["perms"]["create"]
): BuilderParams<T, any>["perms"]["create"] {
  return (jwtBody: JWTBody | undefined) => {
    if (jwtBody?.userType === "Admin") return {Always: true}
    return fun(jwtBody)
  }
}

export const levelsController = controller("level", [
  ...levelBaseEndpoints,
  {
    path: "/import-map",
    method: "post",
    endpointBuilder: importLevels
  }
])
