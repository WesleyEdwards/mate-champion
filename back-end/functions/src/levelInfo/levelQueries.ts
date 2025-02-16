import {z} from "zod"
import {LevelMap, levelMapSchema} from "../levelMap/levelMapQueries"
import {LevelInfo, levelSchema} from "./level_controller"
import {MServerCtx} from "../controllers/appClients"
import {buildQuery} from "simply-served"

export const importLevels = buildQuery<
  MServerCtx,
  {toImport: {level: LevelInfo; map: LevelMap}[]}
>({
  validator: z.lazy(() =>
    z.object({
      toImport: z
        .object({
          level: levelSchema,
          map: levelMapSchema
        })
        .array()
    })
  ),
  authOptions: {
    type: "authenticated"
  },
  fun: async ({req, res, db, auth}) => {
    const {body} = req
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
  }
})
