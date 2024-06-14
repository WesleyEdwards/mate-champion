import {ReqBuilder} from "../auth/authTypes"
import {checkPartialValidation, isParseError} from "../request_body"

export const getLevelMap: ReqBuilder =
  (client) =>
  async ({params, jwtBody}, res) => {
    if (!params.id || typeof params.id !== "string") {
      return res.status(400).json("Bad request")
    }
    const level = await client.level.findOne({_id: params.id})
    if (!level) return res.status(404).json("Not found")
    if (
      level.owner !== jwtBody?.userId &&
      jwtBody?.userType !== "Admin" &&
      !level.public
    ) {
      return res.status(404).json("Cant access")
    }
    const levelMap = await client.levelMap.findOne({_id: params.id})
    return res.json(levelMap)
  }

export const modifyLevelMap: ReqBuilder =
  (client) =>
  async ({params, body, jwtBody}, res) => {
    const condition =
      jwtBody?.userType === "Admin"
        ? {_id: params.id}
        : {_id: params.id, owner: jwtBody?.userId}
    const level = await client.level.findOne(condition)
    if (!level) return res.status(404).json("Not found")
    const levelMapPartial = checkPartialValidation("levelMap", {
      ...body,
      level: params.id,
      updatedAt: new Date().toISOString()
    })
    if (isParseError(levelMapPartial)) return res.status(400).json(levelMapPartial)

    const updatedLevel = await client.level.updateOne(params.id, levelMapPartial)

    return res.json(updatedLevel)
  }
