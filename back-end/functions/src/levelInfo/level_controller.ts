import {importLevels} from "./levelQueries"
import {Infer} from "../types"
import {BuilderParams} from "../simpleServer/server/requestBuilders"
import {createDbObject} from "../simpleServer/validation"
import {
  createBasicMCEndpoints,
  mcController
} from "../controllers/serverBuilders"
import {HasId} from "../simpleServer/DbClient"
import {Clients} from "../controllers/appClients"

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
  permissions: {
    read: ifNotAdmin<LevelInfo>((auth) => ({
      owner: {Equal: auth.jwtBody?.userId ?? ""}
    })),
    delete: ifNotAdmin<LevelInfo>((auth) => ({
      owner: {Equal: auth.jwtBody?.userId ?? ""}
    })),
    create: ifNotAdmin<LevelInfo>((auth) => ({
      owner: {Equal: auth.jwtBody?.userId ?? ""}
    })),
    modify: ifNotAdmin<LevelInfo>((auth) => ({
      owner: {Equal: auth.userId ?? ""}
    }))
  },
  actions: {
    postDelete: async (item, {db}) => {
      await db.levelMap.deleteOne(item._id)
    },
    interceptCreate: async (item, {db}) => {
      const user = await db.user.findOne({_id: {Equal: item.owner}})
      if (!user.success) throw new Error("User not found")
      return {...item, creatorName: user.data.name} satisfies LevelInfo
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
  fun: BuilderParams<T, any>["permissions"]["create"]
): BuilderParams<T, Clients>["permissions"]["create"] {
  return (c) => {
    if (c.auth?.userType === "Admin") return {Always: true}
    return fun(c)
  }
}

export const levelsController = mcController("level", [
  ...levelBaseEndpoints,
  {
    path: "/import-map",
    method: "post",
    endpointBuilder: importLevels
  }
])
