import {z} from "zod"
import {
  baseObjectSchema,
  buildQuery,
  catchError,
  generateAuthCode
} from "simply-served"
import {Infer, JWTBody} from "../types"
import {v4 as uuidv4} from "uuid"
import {MServerCtx} from "../appClients"
import {Route} from "simply-served"
import {createSchema} from "../helpers"
import jwt from "jsonwebtoken"
import {User} from "./user_controller"

export type AuthCode = Infer<typeof authCodeSchema>

export function createUserToken(user: User) {
  const body: JWTBody = {
    userId: user._id,
    userType: user.userType
  }
  return jwt.sign(body, process.env.ENCRYPTION_KEY!, {})
}

export const sendUserBody = (user: User, self: JWTBody | undefined) => {
  if (!self) return null
  if (self.userType === "Admin" || user._id === self.userId) {
    const {passwordHash, ...userWithoutPassword} = user
    return userWithoutPassword
  }
  const {passwordHash, userType: _, ...userWithoutPassword} = user
  return userWithoutPassword
}

export const createAccountSchema = createSchema((z) =>
  z.object({
    email: z.string().email({message: "Invalid email"}),
    name: z.string().optional(),
    highScore: z.number().optional()
  })
)

export const authCodeSchema = z
  .object({code: z.string(), email: z.string()})
  .merge(baseObjectSchema)

export const authController: Route<MServerCtx>[] = [
  buildQuery<MServerCtx>("get")
    .path("/self")
    .withAuth({type: "authenticated"})
    .build(async ({res, db, auth}) => {
      const user = await db.user.findOneById(auth.userId)
      return res.json(sendUserBody(user, auth))
    }),

  buildQuery<MServerCtx>("post")
    .path("/create")
    .withBody({validator: createAccountSchema})
    .build(async ({db, email, req, res}) => {
      const {body} = req

      const [_, user] = await catchError(
        db.user.findOne({email: {Equal: body.email}})
      )

      if (!user) {
        await db.user.insertOne({
          name: body.name ?? body.email,
          email: body.email,
          passwordHash: undefined,
          highScore: body.highScore ?? 0,
          userType: "User",
          _id: uuidv4()
        })
      }

      const authCode = authCodeSchema.parse({
        code: generateAuthCode(),
        email: body.email
      })

      db.authCode.insertOne(authCode)

      await email.send({
        html: `Your verification code is <b>${authCode.code}</b>`,
        subject: "Mate Champion Verification",
        to: body.email
      })
      return res.status(200).json({identifier: authCode._id})
    }),

  buildQuery<MServerCtx>("post")
    .path("/sendAuthCode")
    .withBody({
      validator: createSchema((z) =>
        z.object({
          email: z.string().email({message: "Invalid email"})
        })
      )
    })
    .build(async ({db, email, req, res}) => {
      const {body} = req

      const user = await db.user.findOne({email: {Equal: body.email}})
      if (!user) {
        return res.status(400).json({message: "No user found"})
      }

      const authCode = authCodeSchema.parse({
        code: generateAuthCode(),
        email: body.email
      })

      db.authCode.insertOne(authCode)

      await email.send({
        html: `Your verification code is <b>${authCode.code}</b>`,
        subject: "Mate Champion Verification",
        to: body.email
      })
      return res.status(200).json({identifier: authCode._id})
    }),

  buildQuery<MServerCtx>("post")
    .path("/submitAuthCode")
    .withBody({
      validator: createSchema((z) =>
        z.object({email: z.string(), code: z.string()})
      )
    })
    .build(async ({db, req, res}) => {
      const {body} = req
      const [error, code] = await catchError(
        db.authCode.findOne({
          And: [{email: {Equal: body.email}}, {code: {Equal: body.code}}]
        })
      )

      if (error) {
        return res.status(400).json("Invalid code")
      }

      const user = await db.user.findOne({email: {Equal: body.email}})

      await db.authCode.deleteOne(code._id)

      return res.json({
        user: sendUserBody(user, {
          userId: user._id,
          userType: user.userType
        }),
        token: createUserToken(user)
      })
    })
]
