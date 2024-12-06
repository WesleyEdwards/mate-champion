import request from "supertest"
import {getMockApp} from "./mocks/mockApp"

const mockApp = getMockApp()

describe("Unauthorized Query", () => {
  it("Unauthorized", async () => {
    const response = await request(mockApp).get(`/user/query`)
    expect(response.status).toBe(401)
    expect(response.body).toMatchObject({message: "Unauthorized"})
  })
})
describe("Not Found", () => {
  it("Should be not found", async () => {
    const response = await request(mockApp).get(`/us`)
    expect(response.status).toBe(404)
  })
})
