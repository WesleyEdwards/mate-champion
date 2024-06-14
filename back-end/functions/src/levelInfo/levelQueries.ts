import {v4 as uuidv4} from "uuid"
import {Condition} from "../DbClient"
import {ReqBuilder} from "../auth/authTypes"
import {
  checkPartialValidation,
  checkValidation,
  isParseError
} from "../request_body"
import {LevelInfo} from "../types"

export const getLevel: ReqBuilder =
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
    return res.json(level)
  }

export const createLevel: ReqBuilder =
  (client) =>
  async ({jwtBody, body}, res) => {
    const levelBody = checkValidation("level", {
      ...body,
      owner: body.owner ?? jwtBody?.userId
    })
    if (isParseError(levelBody)) return res.status(400).json(levelBody)
    if (levelBody.owner !== jwtBody?.userId) {
      return res
        .status(400)
        .json({error: "You can only create this for yourself"})
    }
    const user = await client.user.findOne({_id: levelBody.owner})
    if (!user) return res.status(500).json("500")
    const levelId: string = uuidv4()
    const level = await client.level.insertOne({
      ...levelBody,
      _id: levelId,
      creatorName: user.name
    })
    const levelmap = await client.levelMap.insertOne({
      _id: levelId,
      endPosition: 4500,
      packages: [],
      opponents: {grog: []},
      floors: [],
      platforms: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    if (!level || !levelmap)
      return res.status(500).json({error: "Error creating user"})

    return res.json(level)
  }

export const queryLevel: ReqBuilder =
  (client) =>
  async ({jwtBody, body}, res) => {
    const query: Condition<LevelInfo> =
      jwtBody?.userType === "Admin"
        ? body
        : {...body, or: [{owner: jwtBody?.userId}, {public: true}]}
    const levels = await client.level.findMany(query)
    return res.json(levels)
  }

export const queryPartialLevel: ReqBuilder =
  (client) =>
  async ({jwtBody, body}, res) => {
    if (!("condition" in body)) {
      return res.status(400).json("Please provide a condition")
    }
    if (!("fields" in body) || !Array.isArray(body.fields)) {
      return res.status(400).json("Please provide fields to query by")
    }
    const query: Condition<LevelInfo> =
      jwtBody?.userType === "Admin"
        ? body.condition
        : {...body.condition, or: [{owner: jwtBody?.userId}, {public: true}]}
    const levels = await client.level.queryPartial(query, body.fields)
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
    const condition =
      jwtBody?.userType === "Admin"
        ? {_id: params.id}
        : {_id: params.id, owner: jwtBody?.userId}
    const level = await client.level.findOne(condition)
    if (!level) return res.status(404).json("Not found")
    const levelPartial = checkPartialValidation("level", {
      ...body,
      _id: params.id,
      updatedAt: new Date().toISOString()
    })
    if (isParseError(levelPartial)) return res.status(400).json(levelPartial)

    const updatedLevel = await client.level.updateOne(params.id, levelPartial)
    return res.json(updatedLevel)
  }

export const deleteLevel: ReqBuilder =
  (client) =>
  async ({params, jwtBody}, res) => {
    if (!params.id) return res.status(400).json("Error")
    const condition =
      jwtBody?.userType === "Admin"
        ? {_id: params.id}
        : {_id: params.id, owner: jwtBody?.userId}
    const level = await client.level.findOne(condition)
    if (level === undefined) {
      return res.json(404).json({"level not found": level})
    }
    const deleted = await client.level.deleteOne(params.id)
    const deletedMap = await client.levelMap.deleteOne(params.id)
    if (!deleted || !deletedMap) {
      return res.status(500).json("Error deleting level")
    }
    return res.json(deleted)
  }
