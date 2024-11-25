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

export const createUser: ReqBuilder<{password: string}> =
  ({db}) =>
  async ({body}, res) => {
    const passwordHash = await bcrypt.hash(body.password, 10)
    const userBody = checkValidation("user", {...body, passwordHash})
    if (isParseError(userBody)) return res.status(400).json(userBody)

    const emailExists = await db.user.findOne({
      email: {equal: userBody.email ?? ""}
    })

    console.log("Email", emailExists)
    if (isValid(emailExists)) {
      return res.status(400).json({error: "Email already exists"})
    }
    const user = await db.user.insertOne(userBody)
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
    await db.score.insertOne(scoreBody)

    return res.json({
      user: sendUserBody(user, {userId: user._id, userType: user.userType}),
      token
    })
  }

export const loginWithPassword: ReqBuilder<{email: string; password: string}> =
  ({db}) =>
  async ({body}, res) => {
    const loginBody = {
      email: body.email,
      password: body.password
    }

    if (!loginBody.email) {
      res.status(404).json({message: "Invalid credentials"})
      return
    }
    const userWithEmail = await db.user.findOne({
      email: {equal: loginBody.email}
    })
    const userWithName = await db.user.findOne({
      name: {equal: loginBody.email}
    })
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

export const sendAuthCode: ReqBuilder<{email: string}> =
  ({db, email}) =>
  async ({body}, res) => {
    if (!("email" in body)) {
      return res.status(400).json("Invalid email")
    }
    const authCode = checkValidation("authCode", {
      code: randomCode(),
      email: body.email
    })
    if (isParseError(authCode)) {
      return res.status(400).json(authCode)
    }

    db.authCode.insertOne(authCode)

    await email.send({
      html: `Your verification code is ${authCode.code}`,
      subject: "Mate Champion Verification",
      to: body.email
    })
    return res.status(200).json({identifier: authCode._id})
  }

export const submitAuthCode: ReqBuilder<{email: string; code: string}> =
  ({db}) =>
  async ({body}, res) => {
    if (!("email" in body) || !("code" in body)) {
      return res.status(400).json("Invalid body")
    }

    const code = await db.authCode.findOne({
      and: [{email: {equal: body.email}}, {code: {equal: body.code}}]
    })

    if (!isValid(code)) {
      return res.status(400).json("Invalid code")
    }

    const user = await db.user.findOne({email: {equal: body.email}})

    if (!isValid<User>(user)) {
      console.log("Need to create a user")
      return res.status(400).json("unable to find user")
    }

    return res.json({
      user: sendUserBody(user, {userId: user._id, userType: user.userType}),
      token: createUserToken(user)
    })
  }

export const getSelf: ReqBuilder =
  ({db}) =>
  async ({jwtBody}, res) => {
    const user = await db.user.findOne({
      _id: {equal: jwtBody?.userId || ""}
    })
    if (!isValid<User>(user)) return res.status(404).json("Not found")
    return res.json(sendUserBody(user, jwtBody))
  }

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
