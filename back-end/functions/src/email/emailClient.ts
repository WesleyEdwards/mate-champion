import {MailDataRequired, MailService} from "@sendgrid/mail"
import {EmailClient} from "../simpleServer/appClients"

const sgMail: MailService = require("@sendgrid/mail")

const msg: MailDataRequired = {
  from: "westheedwards@gmail.com",
  html: ""
}

export const emailClient = (option: string, key?: string): EmailClient => {
  if (option === "sendgrid" && key) {
    return sendgridEmail(key)
  }
  return localEmail()
}

const sendgridEmail = (key: string): EmailClient => {
  sgMail.setApiKey(key)
  return {
    send: async (params) => {
      console.log("Sending email")
      try {
        const res = await sgMail.send({...msg, ...params})
        console.log("Sent email", res[0].toString())
      } catch (error: any) {
        console.error(error)

        if (error.response) {
          console.error(error.response.body)
        }
      }
    }
  }
}
const localEmail = (): EmailClient => {
  return {
    send: async (params) => {
      try {
        console.log("------------------------------")
        console.log(`Sending email to ${params.to}`)
        console.log(params.subject)
        console.log(params.html)
        console.log("------------------------------")
      } catch (error: any) {
        console.error(error)

        if (error.response) {
          console.error(error.response.body)
        }
      }
    }
  }
}
