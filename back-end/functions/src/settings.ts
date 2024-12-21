import dotenv from "dotenv"

dotenv.config({path: `.env.${process.env.NODE_ENV || "production"}`})

console.log("NODE_ENV is", process.env.NODE_ENV)

export type Settings = {
  mongoUri: string
  emailProvider: string
  emailKey: string
}

export const settings: Settings = {
  mongoUri: process.env.MONGO_URI!,
  emailProvider: process.env.EMAIL_PROVIDER!,
  emailKey: process.env.SENDGRID_API_KEY!
}
