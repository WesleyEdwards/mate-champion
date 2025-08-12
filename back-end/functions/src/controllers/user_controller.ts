import {maskKeysBasedOnPerms, modelRestEndpoints} from "simply-served"
import {Infer, userTypeSchema} from "../types"
import {createDbObject, permsIfNotAdmin} from "../helpers"
import {MServerCtx} from "../appClients"

export type User = Infer<typeof userSchema>

const userSchema = createDbObject((z) =>
  z.object({
    name: z.string().min(1, {error: "Name is required"}),
    email: z.email({error: "Invalid email"}),
    passwordHash: z.string().optional(),
    highScore: z.number().default(0),
    userType: userTypeSchema.default("User")
  })
)

export const usersController = modelRestEndpoints<MServerCtx, User>({
  validator: userSchema,
  collection: (db) => db.user,
  permissions: permsIfNotAdmin<User>({
    read: {
      type: "modelAuth",
      check: (auth) => ({_id: {Equal: auth.userId}})
    },
    delete: {type: "modelAuth", check: (auth) => ({_id: {Equal: auth.userId}})},
    create: {type: "notAllowed"},
    modify: {type: "modelAuth", check: (auth) => ({_id: {Equal: auth.userId}})}
  }),
  actions: {
    prepareResponse: maskKeysBasedOnPerms((user, {auth}) => {
      if (!auth) return {passwordHash: true}
      const canViewAccess =
        auth.userType === "Admin" || user._id === auth.userId
      if (canViewAccess) {
        return {passwordHash: true}
      }
      return {passwordHash: true, userType: true}
    })
  }
})
