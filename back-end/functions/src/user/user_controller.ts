import {controller} from "../auth/controller"
import {createUser, getSelf, getUser, loginUser, queryUser} from "./userQueries"

export const usersController = controller("user", [
  {
    path: "/create",
    method: "post",
    endpointBuilder: createUser,
    skipAuth: true
  },
  {path: "/", method: "get", endpointBuilder: getSelf},
  {path: "/:id", method: "get", endpointBuilder: getUser},
  {path: "/query", method: "post", endpointBuilder: queryUser},
  {
    path: "/login",
    method: "post",
    endpointBuilder: loginUser,
    skipAuth: true
  }
])
