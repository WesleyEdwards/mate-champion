import {MServerCtx} from "../appClients"
import {z} from "zod"
import {buildRoute, modelRestEndpoints} from "simply-served"
import {permsIfNotAdmin} from "../helpers"
import {LevelMap, levelMapSchema} from "./level_map_controller"

export const levelSchema = z.object({
  owner: z.string(),
  public: z.boolean().default(false),
  name: z.string(),
  description: z.string().nullable().default(null),
  creatorName: z.string().default(""),
  _id: z.string()
})

export type LevelInfo = z.infer<typeof levelSchema>

export const levelsController = {
  ...modelRestEndpoints({
    validator: levelSchema,
    collection: (db) => db.level,
    permissions: permsIfNotAdmin<LevelInfo>({
      read: {
        type: "modelAuth",
        check: (auth) => ({
          Or: [{owner: {Equal: auth.userId}}, {public: {Equal: true}}]
        })
      },
      delete: {
        type: "modelAuth",
        check: (auth) => ({owner: {Equal: auth.userId}})
      },
      create: {
        type: "modelAuth",
        check: (auth) => ({owner: {Equal: auth.userId}})
      },
      modify: {
        type: "modelAuth",
        check: (auth) => ({owner: {Equal: auth.userId}})
      }
    }),
    actions: {
      postDelete: async (item, {db}) => {
        await db.levelMap.deleteOne(item._id)
      },
      interceptCreate: async (item, {db}) => {
        const user = await db.user.findOne({_id: {Equal: item.owner}})
        if (!user) throw new Error("User not found")
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
          floors: [{x: -500, width: 7000}],
          platforms: []
        })
      }
    }
  }),
  importMap: buildRoute<MServerCtx>("post")
    .path("/import-map")
    .withAuth()
    .withBody({
      validator: z.lazy(() =>
        z.object({
          toImport: z
            .object({
              level: levelSchema,
              map: levelMapSchema
            })
            .array()
        })
      )
    })
    .build(async ({body, db}, res, auth) => {
      const creator = await db.user.findOne({_id: {Equal: auth.userId}})

      const updateLevels: LevelInfo[] = body.toImport.map((level) => ({
        ...level.level,
        creatorName: creator.name,
        owner: creator._id
      }))
      const updateMaps: LevelMap[] = body.toImport.map((map) => map.map)

      let successes = 0
      for (const level of updateLevels) {
        const mapFor = updateMaps.find((m) => m._id === level._id)
        if (!mapFor) continue
        const success = await db.level.insertOne(level)
        if (success) {
          await db.levelMap.insertOne(mapFor)
        }
        successes++
      }

      return res.json(successes)
    })
}
