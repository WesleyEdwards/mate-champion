import {controller, Route} from "../auth/controller"

import {DbClient} from "../DbClient"
import {importLevels} from "./levelQueries"
import {LevelInfo, User} from "../types"
import {
  createBuilder,
  getBuilder,
  queryBuilder,
  modifyBuilder,
  deleteBuilder,
  BuildEndpoints
} from "../requestBuilders"
import {
  checkPartialValidation,
  checkValidation,
  isParseError,
  isValid
} from "../request_body"

const levelBaseEndpoints: BuildEndpoints<LevelInfo> = (db: DbClient) => {
  const endpoint = db.level
  return {
    get: getBuilder({
      endpoint,
      perms: (jwtBody) => {
        if (jwtBody?.userType === "Admin") return {always: true}
        return {
          or: [{public: true}, {owner: jwtBody?.userId ?? ""}]
        }
      }
    }),
    query: queryBuilder({
      endpoint,
      perms: (jwtBody) =>
        jwtBody?.userType === "Admin"
          ? {always: true}
          : {or: [{owner: jwtBody?.userId}, {public: true}]}
    }),
    create: createBuilder({
      endpoint,
      perms: (jwtBody, level) => jwtBody?.userId === level.owner,
      validate: async (body) => {
        const val = checkValidation("level", body)
        if (isParseError(val)) return val
        const user = await db.user.findOne({_id: val._id})
        if (!isValid<User>(user)) return user
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
    }),
    modify: modifyBuilder({
      endpoint,
      perms: (jwtBody) => {
        return jwtBody?.userType === "Admin" ? {} : {owner: jwtBody?.userId}
      },
      validate: (body) => {
        return checkPartialValidation("level", body)
      }
    }),
    delete: deleteBuilder({
      endpoint,
      perms: (jwtBody) => ({owner: jwtBody?.userId}),
      postDelete: async (item) => {
        await db.levelMap.deleteOne(item._id)
      }
    })
  }
}

export const levelsController = controller("level", (db: DbClient): Route[] => {
  return [
    ...Object.values(levelBaseEndpoints(db)),
    {path: "/import-map", method: "post", endpointBuilder: importLevels(db)}
  ]
})
