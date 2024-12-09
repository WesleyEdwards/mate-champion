import {buildQuery} from "../auth/authTypes"
import {LevelMap, levelMapSchema} from "../levelMap/levelMapQueries"
import {isValid} from "../simpleServer/request_body"
import {createSchema} from "../simpleServer/validation"
import {User} from "../user/user_controller"
import {LevelInfo, levelSchema} from "./level_controller"

export const importLevels = buildQuery({
  validator: createSchema((z) =>
    z.object({
      levels: z.array(levelSchema),
      maps: z.array(levelMapSchema)
    })
  ),
  fun: async ({req, res, db}) => {
    const {body, jwtBody} = req
    const creator = await db.user.findOne({_id: {equal: jwtBody?.userId ?? ""}})
    if (!isValid<User>(creator)) {
      return res.json(404).json({error: "User not found"})
    }

    const updateLevels: LevelInfo[] = body.levels.map((level) => ({
      ...level,
      creatorName: creator.name,
      owner: creator._id
    }))
    const updateMaps: LevelMap[] = body.maps.map((map) => ({
      ...map
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
