import request from "supertest"
import {authorizedToken} from "./mocks/authCodes"
import {getMockApp} from "./mocks/mockApp"

const mockApp = getMockApp()

const path = "auth"

describe("Submit Auth code", () => {
  it("Successful submission", async () => {
    const response = await request(mockApp)
      .post(`/${path}/submitAuthCode`)
      .send({
        code: "TESTCO",
        email: "wesley@test.com"
      })
    expect(response.status).toBe(200)
    expect(response.body.user).toMatchObject({
      _id: "a309745a-db86-44f0-97dc-352ef9f62257",
      email: "wesley@test.com",
      highScore: 100,
      name: "Wesley",
      userType: "User"
    })
    expect(response.body.token).toBeTruthy()
  })

  it("Unsuccessful submission", async () => {
    const response = await request(mockApp)
      .post(`/${path}/submitAuthCode`)
      .send({
        code: "TESTCI",
        email: "wesley@test.com"
      })
    expect(response.status).toBe(400)
  })
})

describe("Auth Functions", () => {
  it("Get self", async () => {
    const response = await request(mockApp)
      .get(`/${path}/self`)
      .set("Authorization", `bearer ${authorizedToken}`)
    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      _id: "a309745a-db86-44f0-97dc-352ef9f62257",
      email: "wesley@test.com",
      highScore: 100,
      name: "Wesley",
      userType: "User"
    })
  })
})
