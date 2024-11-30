import bcrypt from "bcrypt"
import {buildQuery, JWTBody} from "../auth/authTypes"
import jwt from "jsonwebtoken"
import {checkValidSchema, isParseError, isValid} from "../request_body"
import {createSchema} from "../types"
import {v4 as uuidv4} from "uuid"
import {User} from "./user_controller"
import {authCodeSchema} from "./auth_controller"

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

export const loginWithPassword = buildQuery({
  validator: createSchema((z) =>
    z.object({email: z.string(), password: z.string()})
  ),
  fun: async ({req, res, db}) => {
    const {body} = req

    const user = await db.user.findOne({
      email: {equal: body.email}
    })

    if (!isValid<User>(user) || !user.passwordHash) {
      return res.status(404).json({message: "Invalid credentials"})
    }

    const isValidPassword = await bcrypt.compare(
      body.password,
      user.passwordHash
    )
    if (!isValidPassword) {
      return res.status(404).json({message: "Invalid credentials"})
    }

    return res.json({
      user: sendUserBody(user, {userId: user._id, userType: user.userType}),
      token: createUserToken(user)
    })
  }
})

export const sendAuthCode = buildQuery({
  validator: createSchema((z) =>
    z.object({email: z.string(), name: z.string().optional()})
  ),
  fun: async ({db, email, req, res}) => {
    const {body} = req
    const code = {
      code: randomCode(),
      email: body.email
    }
    const user = await db.user.findOne({email: {equal: body.email}})

    if (!isValid<User>(user)) {
      const newUser: User = {
        name: body.name ?? body.email,
        email: body.email,
        passwordHash: undefined,
        highScore: 0,
        userType: "User",
        _id: uuidv4()
      }
      await db.user.insertOne(newUser)
    }

    const authCode = checkValidSchema(code, authCodeSchema)
    if (isParseError(authCode)) {
      return res.status(400).json(authCode)
    }

    db.authCode.insertOne(authCode)

    await email.send({
      html: `Your verification code is <b>${authCode.code}</b>`,
      subject: "Mate Champion Verification",
      to: body.email
    })
    return res.status(200).json({identifier: authCode._id})
  }
})

export const submitAuthCode = buildQuery({
  validator: createSchema((z) =>
    z.object({email: z.string(), code: z.string()})
  ),
  fun: async ({db, req, res}) => {
    const {body} = req
    const code = await db.authCode.findOne({
      and: [{email: {equal: body.email}}, {code: {equal: body.code}}]
    })

    if (!isValid(code)) {
      return res.status(400).json("Invalid code")
    }

    const user = await db.user.findOne({email: {equal: body.email}})

    if (!isValid<User>(user)) {
      return res.status(400).json("unable to find user")
    }

    return res.json({
      user: sendUserBody(user, {userId: user._id, userType: user.userType}),
      token: createUserToken(user)
    })
  }
})

export const getSelf = buildQuery({
  fun: async ({res, db, req}) => {
    const {jwtBody} = req
    const user = await db.user.findOne({
      _id: {equal: jwtBody?.userId || ""}
    })
    if (!isValid<User>(user)) return res.status(404).json("Not found")
    return res.json(sendUserBody(user, jwtBody))
  }
})

function randomCode() {
  let result = ""
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let counter = 0
  while (counter < 6) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
    counter += 1
  }
  return result
}
