import {controller, Route} from "../auth/controller"
import {DbClient} from "../DbClient"
import {importLevels} from "./levelQueries"
import {LevelInfo, User} from "../types"
import {createBasicEndpoints} from "../requestBuilders"
import {checkPartialValidation, checkValidation, isValid} from "../request_body"

const levelBaseEndpoints = (db: DbClient) =>
  createBasicEndpoints<LevelInfo>({
    endpoint: db.level,
    get: {
      perms: (jwtBody) => {
        if (jwtBody?.userType === "Admin") return {always: true}
        return {
          or: [{public: {equal: true}}, {owner: {equal: jwtBody?.userId ?? ""}}]
        }
      }
    },
    query: {
      perms: (jwtBody) =>
        jwtBody?.userType === "Admin"
          ? {always: true}
          : {
              or: [
                {owner: {equal: jwtBody?.userId ?? ""}},
                {public: {equal: true}}
              ]
            }
    },
    create: {
      validate: async (body, jwtBody) => {
        const val = checkValidation("level", body)
        if (!isValid<LevelInfo>(val)) return val
        const user = await db.user.findOne({_id: {equal: val.owner}})
        if (!isValid<User>(user)) return user
        if (jwtBody?.userId !== val.owner) {
          return {error: "not owner"}
        }
        return {...val, creatorName: user.name} satisfies LevelInfo
      },
      postCreate: async (level) => {
        await db.levelMap.insertOne({
          champInitPos: [400, 400],
          _id: level._id,
          endPosition: 4500,
          packages: [],
          groog: [],
          platformColor: "springgreen",
          floors: [{x: -500, width: 7000, color: "green"}],
          platforms: []
        })
      }
    },
    modify: {
      perms: (jwtBody) => {
        return jwtBody?.userType === "Admin"
          ? {always: true}
          : {owner: {equal: jwtBody?.userId ?? ""}}
      },
      validate: (body) => {
        return checkPartialValidation("level", body)
      }
    },
    del: {
      perms: (jwtBody) => ({owner: {equal: jwtBody?.userId ?? ""}}),
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
