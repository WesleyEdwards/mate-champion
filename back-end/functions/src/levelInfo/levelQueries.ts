import {buildMCQuery} from "../controllers/serverBuilders"
import {LevelMap, levelMapSchema} from "../levelMap/levelMapQueries"
import {createSchema} from "../simpleServer/validation"
import {LevelInfo, levelSchema} from "./level_controller"

export const importLevels = buildMCQuery({
  validator: createSchema((z) =>
    z.object({
      toImport: z
        .object({
          level: levelSchema,
          map: levelMapSchema
        })
        .array()
    })
  ),
  fun: async ({req, res, db, auth}) => {
    const {body} = req
    const creator = await db.user.findOne({_id: {Equal: auth?.userId ?? ""}})
    if (!creator.success) {
      return res.json(404).json({error: "User not found"})
    }

    const updateLevels: LevelInfo[] = body.toImport.map((level) => ({
      ...level.level,
      creatorName: creator.data.name,
      owner: creator.data._id
    }))
    const updateMaps: LevelMap[] = body.toImport.map((map) => ({
      ...map.map
    }))

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
