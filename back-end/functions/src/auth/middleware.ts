import {MServerCtx} from "../controllers/appClients"
import {UserType} from "../types"
import {Request} from "express"
import jwt from "jsonwebtoken"

export type JWTBody = {
  userId: string
  userType: UserType
}

const isJwt = (x: any): x is JWTBody => "userId" in x && "userType" in x

export const middleware = (
  req: Request,
  clients: MServerCtx,
  skipAuth?: boolean
) => {
  const token = req.headers.authorization?.split(" ")?.at(1)
  if (token) {
    try {
      const jwtBody = jwt.verify(token || "", process.env.ENCRYPTION_KEY!)
      if (isJwt(jwtBody)) {
        return {...clients, auth: jwtBody}
      }
    } catch (e) {
      return null
    }
  }

  if (skipAuth) {
    return {...clients, auth: undefined}
  } else {
    return null
  }
}
