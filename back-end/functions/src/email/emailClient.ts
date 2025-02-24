import {MailDataRequired} from "@sendgrid/mail"
import {EmailClient} from "../appClients"

import sgMail from "@sendgrid/mail"

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
      try {
        const res = await sgMail.send({...msg, ...params})
        console.log("Email sent", res[0].toString())
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
        console.info(
          `
          ------------------------------
          Sending email to ${params.to}
          ${params.subject}
          ${params.html}
          ------------------------------

          `
        )
      } catch (error: any) {
        console.error(error)
        if (error.response) {
          console.error(error.response.body)
        }
      }
    }
  }
}
