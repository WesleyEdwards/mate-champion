import {ReqBuilder} from "../auth/authTypes"
import {
  checkPartialValidation,
  checkValidation,
  isParseError
} from "../request_body"

export const getLevel: ReqBuilder =
  (client) =>
  async ({params, jwtBody}, res) => {
    if (!params.id || typeof params.id !== "string") {
      return res.status(400).json("Bad request")
    }
    const level = await client.level.findOne({_id: params.id})
    if (!level) return res.status(404).json("Not found")
    if (level.owner !== jwtBody?.userId && !jwtBody?.admin) {
      return res.status(404).json("Cant access")
    }
    return res.json(level)
  }

export const createLevel: ReqBuilder =
  (client) =>
  async ({jwtBody, body}, res) => {
    const levelBody = checkValidation("level", {...body})
    if (isParseError(levelBody)) return res.status(400).json(levelBody)
    if (levelBody.owner !== jwtBody?.userId) {
      return res
        .status(400)
        .json({error: "You can only create this for yourself"})
    }
    const user = await client.user.findOne({_id: levelBody.owner})
    if (!user) return res.status(500).json("500")
    const level = await client.level.insertOne({
      ...levelBody,
      creatorName: user.name
    })
    if (!level) return res.status(500).json({error: "Error creating user"})
    return res.json(level)
  }

export const queryLevel: ReqBuilder =
  (client) =>
  async ({jwtBody, body}, res) => {
    const levels = await client.level.findMany(body)
    return res.json(levels)
  }

export const generateLevels: ReqBuilder =
  (client) =>
  async ({body}, res) => {
    const levelIds = body as string[]
    if (!Array.isArray(levelIds)) {
      return res.status(400).json("Please supply a list of ids of levels")
    }
    const levels = await client.level.findMany({_id: levelIds})

    return res.json(
      levels.sort((a, b) => levelIds.indexOf(a._id) - levelIds.indexOf(b._id))
    )
  }

export const modifyLevel: ReqBuilder =
  (client) =>
  async ({params, body, jwtBody}, res) => {
    const level = await client.level.findOne({_id: params.id})
    if (!level) return res.status(404).json("Not found")
    if (!jwtBody?.admin && jwtBody?.userId !== level.owner) {
      return res.status(404).json("Not found")
    }
    const levelPartial = checkPartialValidation("level", {
      ...body,
      _id: params.id,
      updatedAt: new Date().toISOString()
    })
    if (isParseError(levelPartial)) return res.status(400).json(levelPartial)

    const updatedLevel = await client.user.updateOne(params.id, levelPartial)
    return res.json(updatedLevel)
  }

export const deleteLevel: ReqBuilder =
  (client) =>
  async ({params, body, jwtBody}, res) => {
    if (!params.id) return res.status(400).json("Error")
    const level = await client.level.findOne({_id: params.id})
    if (level === undefined) {
      return res.json(404).json({"level not found": level})
    }
    if (level.owner !== jwtBody?.userId && !jwtBody?.admin) {
      return res.status(403).json({error: "can't do that"})
    }
    const deleted = await client.level.deleteOne(params.id)
    return res.json(deleted)
  }
