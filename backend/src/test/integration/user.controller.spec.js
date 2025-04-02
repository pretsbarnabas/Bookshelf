process.argv.push("test")
const app = require("../../main")
const request = require("supertest")

describe("User Controller Integration Tests",()=>{

    it("should return 200 and users with pagecount",async()=>{
        const response = await request(app).get("/api/users")
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.data.length).toBeGreaterThan(0)
    })
})