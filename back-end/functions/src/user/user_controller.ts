import {Clients} from "../appClients"
import {controller} from "../auth/controller"
import {checkPartialValidation, isValid} from "../request_body"
import {createBasicEndpoints} from "../requestBuilders"
import {User} from "../types"
import {createUser, getSelf, loginUser} from "./userQueries"

const userBaseEndpoints = ({db}: Clients) => {
  const preResponseFilter = (user: User) => {
    const {passwordHash, ...rest} = user
    return rest as User
  }
  return createBasicEndpoints<User>({
    endpoint: db.user,
    get: {
      perms: (jwtBody) => {
        if (jwtBody?.userType === "Admin") return {always: true}
        return {_id: {equal: jwtBody?.userId ?? ""}}
      },
      preResponseFilter
    },
    create: null,
    query: {
      perms: (jwtBody) => {
        if (jwtBody?.userType === "Admin") return {always: true}
        return {_id: {equal: jwtBody?.userId ?? ""}}
      },
      preResponseFilter: (users) => users.map(preResponseFilter)
    },
    modify: {
      perms: (jwtBody) => {
        if (jwtBody?.userType === "Admin") return {always: true}
        return {_id: {equal: jwtBody?.userId ?? ""}}
      },
      validate: (body, jwtBody) => {
        const userPartial = checkPartialValidation("user", body)
        if (!isValid<User>(userPartial)) return userPartial

        if (jwtBody?.userType !== "Admin" && userPartial.userType) {
          return {error: "Unauthorized"}
        }

        return userPartial
      },
      preResponseFilter
    },
    del: {
      perms: (jwtBody) => {
        if (jwtBody?.userType === "Admin") return {always: true}
        return {_id: {equal: jwtBody?.userId ?? ""}}
      }
    }
  })
}

export const usersController = controller("user", (params) => [
  ...userBaseEndpoints(params),
  {path: "/", method: "get", endpointBuilder: getSelf(params)},
  {
    path: "/create",
    method: "post",
    endpointBuilder: createUser(params),
    skipAuth: true
  },
  {
    path: "/login",
    method: "post",
    endpointBuilder: loginUser(params),
    skipAuth: true
  }
])
