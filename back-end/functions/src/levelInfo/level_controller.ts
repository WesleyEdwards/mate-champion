import {importLevels} from "./levelQueries"
import {MServerCtx} from "../controllers/appClients"
import {z} from "zod"
import {modelRestEndpoints, Route} from "simply-served"
import {permsIfNotAdmin} from "../helpers"

export const levelSchema = z.object({
  owner: z.string(),
  public: z.boolean().default(false),
  name: z.string(),
  description: z.string().nullable().default(null),
  creatorName: z.string().default(""),
  _id: z.string()
})

export type LevelInfo = z.infer<typeof levelSchema>

const levelBaseEndpoints = modelRestEndpoints({
  validator: levelSchema,
  collection: (db) => db.level,
  permissions: permsIfNotAdmin<LevelInfo>({
    read: {
      modelAuth: (auth) => ({
        Or: [{owner: {Equal: auth.userId}}, {public: {Equal: true}}]
      })
    },
    delete: {
      modelAuth: (auth) => ({owner: {Equal: auth.userId}})
    },
    create: {
      modelAuth: (auth) => ({owner: {Equal: auth.userId}})
    },
    modify: {
      modelAuth: (auth) => ({owner: {Equal: auth.userId}})
    }
  }),
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
        floors: [{x: -500, width: 7000}],
        platforms: []
      })
    }
  }
})

export const levelsController: Route<MServerCtx>[] = [
  {
    path: "/import-map",
    method: "post",
    endpointBuilder: importLevels
  },
  ...levelBaseEndpoints
]
