import {UserType} from "../types"

export type JWTBody = {
  userId: string
  userType: UserType
}
