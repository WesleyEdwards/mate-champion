import {z} from "zod"
import jwt from "jsonwebtoken"
import {v4 as uuidv4} from "uuid"
import {User} from "./user_controller"
import {authCodeSchema} from "./auth_controller"
import {catchError, generateAuthCode} from "simply-served"
import {MServerCtx} from "../controllers/appClients"
import {buildQuery} from "simply-served"
import {createSchema} from "../helpers"
import {JWTBody} from "../types"

function createUserToken(user: User) {
  const body: JWTBody = {
    userId: user._id,
    userType: user.userType
  }
  return jwt.sign(body, process.env.ENCRYPTION_KEY!, {})
}

const sendUserBody = (user: User, self: JWTBody | undefined) => {
  if (!self) return null
  if (self.userType === "Admin" || user._id === self.userId) {
    const {passwordHash, ...userWithoutPassword} = user
    return userWithoutPassword
  }
  const {passwordHash, userType: _, ...userWithoutPassword} = user
  return userWithoutPassword
}

const createAccountSchema = createSchema((z) =>
  z.object({
    email: z.string().email({message: "Invalid email"}),
    name: z.string().optional(),
    highScore: z.number().optional()
  })
)

export const createAccount = buildQuery<
  MServerCtx,
  z.infer<typeof createAccountSchema>
>({
  validator: createAccountSchema,
  authOptions: {type: "publicAccess"},
  fun: async ({db, email, req, res}) => {
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
  }
})

export const sendAuthCode = buildQuery<MServerCtx, {email: string}>({
  validator: createSchema((z) =>
    z.object({
      email: z.string().email({message: "Invalid email"})
    })
  ),
  authOptions: {type: "publicAccess"},
  fun: async ({db, email, req, res}) => {
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
  }
})

export const submitAuthCode = buildQuery<
  MServerCtx,
  {email: string; code: string}
>({
  validator: createSchema((z) =>
    z.object({email: z.string(), code: z.string()})
  ),
  authOptions: {type: "publicAccess"},
  fun: async ({db, req, res}) => {
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
  }
})

export const getSelf = buildQuery<MServerCtx, User>({
  authOptions: {type: "authenticated"},
  fun: async ({res, db, auth}) => {
    const user = await db.user.findOneById(auth.userId)
    return res.json(sendUserBody(user, auth))
  }
})
