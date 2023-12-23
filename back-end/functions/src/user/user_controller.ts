import {controller} from "../auth/controller"
import {
  modifyUser,
  createUser,
  getSelf,
  getUser,
  loginUser,
  queryUser,
  deleteUser
} from "./userQueries"

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
  {path: "/:id", method: "put", endpointBuilder: modifyUser},
  {path: "/:id", method: "delete", endpointBuilder: deleteUser},
  {
    path: "/login",
    method: "post",
    endpointBuilder: loginUser,
    skipAuth: true
  }
])
