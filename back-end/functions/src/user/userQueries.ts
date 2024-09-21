import bcrypt from "bcrypt"
import {JWTBody, ReqBuilder} from "../auth/authTypes"
import jwt from "jsonwebtoken"
import {checkValidation, isParseError, isValid} from "../request_body"
import {Score, User} from "../types"
function createUserToken(user: User) {
  return jwt.sign(
    {
      userId: user._id,
      userType: user.userType
    } satisfies JWTBody,
    process.env.ENCRYPTION_KEY!,
    {}
  )
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

export const createUser: ReqBuilder =
  (client) =>
  async ({body}, res) => {
    const passwordHash = await bcrypt.hash(body.password, 10)
    const userBody = checkValidation("user", {...body, passwordHash})
    if (isParseError(userBody)) return res.status(400).json(userBody)

    const emailExists = await client.user.findOne({
      email: {equal: userBody.email ?? ""}
    })

    console.log("Emial", emailExists)
    if (isValid(emailExists)) {
      return res.status(400).json({error: "Email already exists"})
    }
    const user = await client.user.insertOne(userBody)
    if (!isValid<User>(user)) {
      return res.status(500).json({error: "Error creating user"})
    }

    const token = createUserToken({...userBody, userType: "User"})

    const scoreBody = checkValidation("score", {
      ...body,
      userId: userBody._id,
      score: userBody.highScore
    })

    if (!isValid<Score>(scoreBody)) return res.status(400).json(userBody)
    await client.score.insertOne(scoreBody)

    return res.json({
      user: sendUserBody(user, {userId: user._id, userType: user.userType}),
      token
    })
  }

export const loginUser: ReqBuilder =
  (client) =>
  async ({body}, res) => {
    const loginBody = {
      email: body.email,
      password: body.password
    }

    if (!loginBody.email) {
      res.status(404).json({message: "Invalid credentials"})
      return
    }
    const userWithEmail = await client.user.findOne({email: loginBody.email})
    const userWithName = await client.user.findOne({name: loginBody.email})
    const user = userWithEmail ?? userWithName

    if (!isValid<User>(user)) {
      res.status(404).json({message: "Invalid credentials"})
      return
    }

    const isValidPassword = await bcrypt.compare(
      loginBody.password,
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

export const getSelf: ReqBuilder =
  (client) =>
  async ({jwtBody}, res) => {
    const user = await client.user.findOne({
      _id: {equal: jwtBody?.userId || ""}
    })
    if (!isValid<User>(user)) return res.status(404).json("Not found")
    return res.json(sendUserBody(user, jwtBody))
  }
