import {ReqBuilder} from "../auth/authTypes"
import {isParseError, isValid, isValidImport} from "../request_body"
import {LevelInfo, LevelMap, User} from "../types"

export type ImportLevelsBody = {
  levels: LevelInfo[]
  maps: LevelMap[]
}

export const importLevels: ReqBuilder =
  (client) =>
  async ({jwtBody, body}, res) => {
    const toImport = body as ImportLevelsBody

    const validate = isValidImport(toImport)
    if (isParseError(validate)) return res.json(400).json({error: "Bad input"})

    const creator = await client.user.findOne({_id: jwtBody?.userId})
    if (!isValid<User>(creator)) {
      return res.json(404).json({error: "User not found"})
    }

    const updateLevels: LevelInfo[] = validate.levels.map((level) => ({
      ...level,
      creatorName: creator.name,
      owner: creator._id
    }))
    const updateMaps: LevelMap[] = validate.maps.map((map) => ({
      ...map
    }))

    let successes = 0
    for (const level of updateLevels) {
      const mapFor = updateMaps.find((m) => m._id === level._id)
      if (!mapFor) continue
      const success = await client.level.insertOne(level)
      if (success) {
        await client.levelMap.insertOne(mapFor)
      }
      successes++
    }

    return res.json(successes)
  }
