import {controller, Route} from "../auth/controller"
import {DbClient} from "../DbClient"
import {importLevels} from "./levelQueries"
import {LevelInfo, User} from "../types"
import {createBasicEndpoints} from "../requestBuilders"
import {
  checkPartialValidation,
  checkValidation,
  isParseError,
  isValid
} from "../request_body"

const levelBaseEndpoints = (db: DbClient) =>
  createBasicEndpoints<LevelInfo>({
    endpoint: db.level,
    get: {
      perms: (jwtBody) => {
        if (jwtBody?.userType === "Admin") return {always: true}
        return {
          or: [{public: true}, {owner: jwtBody?.userId ?? ""}]
        }
      }
    },
    query: {
      perms: (jwtBody) =>
        jwtBody?.userType === "Admin"
          ? {always: true}
          : {or: [{owner: jwtBody?.userId}, {public: true}]}
    },
    create: {
      validate: async (body, jwtBody) => {
        const val = checkValidation("level", body)
        if (isParseError(val)) return val
        const user = await db.user.findOne({_id: val._id})
        if (!isValid<User>(user)) return user
        if (jwtBody?.userId !== val.owner) {
          return {error: "not owner"}
        }
        return {...val, creatorName: user.name}
      },
      postCreate: async (level) => {
        await db.levelMap.insertOne({
          _id: level._id,
          endPosition: 4500,
          packages: [],
          opponents: {grog: []},
          platformColor: "springgreen",
          floors: [{x: -500, width: 7000, color: "green"}],
          platforms: []
        })
      }
    },
    modify: {
      perms: (jwtBody) => {
        return jwtBody?.userType === "Admin" ? {} : {owner: jwtBody?.userId}
      },
      validate: (body) => {
        return checkPartialValidation("level", body)
      }
    },
    del: {
      perms: (jwtBody) => ({owner: jwtBody?.userId}),
      postDelete: async (item) => {
        await db.levelMap.deleteOne(item._id)
      }
    }
  })

export const levelsController = controller("level", (db: DbClient): Route[] => {
  return [
    ...levelBaseEndpoints(db),
    {path: "/import-map", method: "post", endpointBuilder: importLevels(db)}
  ]
})
