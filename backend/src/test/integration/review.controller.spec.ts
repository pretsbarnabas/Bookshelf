process.argv.push("test")
process.argv.push("jest")
import app from "../../main"
import request from "supertest"


let adminToken: string
let userToken: string
let newReview: any
let usedBookId = "7fdb24bfd2c9eaca400201b8"
describe("Review Controller Post Route Tests",()=>{
    beforeAll(async()=>{
        let response = await request(app).post("/api/login").send({username: "admin", password: "admin"})
        console.log(response.body)
        expect(response.body.token).toBeDefined()
        adminToken = response.body.token

        response = await request(app).post("/api/login").send({username: "b", password: "admin"})
        console.log(response.body)
        expect(response.body.token).toBeDefined()
        userToken = response.body.token
        
    })

    it("should post new review with correct body and auth",async()=>{
        const response = await request(app).post("/api/reviews").send({book_id: usedBookId, score: 9, content: "good shit"}).set("Authorization", `Bearer ${userToken}`)
        expect(response.statusCode).toBe(201)
        expect(response.body._id).toBeDefined()
        expect(response.body.book_id).toBe(usedBookId)
        expect(response.body.score).toBe(9)
        expect(response.body.content).toBe("good shit")
        newReview = response.body
    })

    it("should return 401 with no auth",async()=>{
        const response = await request(app).post("/api/reviews").send({book_id: usedBookId, score: 9, content: "good shit"})
        expect(response.statusCode).toBe(401)
        expect(response.body.message).toBe("Unauthorized")
    })

    it("should return 400 on duplicate review on same book",async()=>{
        const response = await request(app).post("/api/reviews").send({book_id: usedBookId, score: 9, content: "good shit"}).set("Authorization", `Bearer ${userToken}`)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe("User already posted a review on book")
    })
    it("should return 400 with missing book_id",async()=>{
        const response = await request(app).post("/api/reviews").send({ score: 9, content: "good shit"}).set("Authorization", `Bearer ${userToken}`)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe("book_id is required")
    })
    it("should return 400 with missing score",async()=>{
        const response = await request(app).post("/api/reviews").send({book_id: usedBookId, content: "good shit"}).set("Authorization", `Bearer ${userToken}`)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe("score is required")
    })
    it("should return 400 with bad id format on book_id",async()=>{
        const response = await request(app).post("/api/reviews").send({book_id: "asd", score: 9, content: "good shit"}).set("Authorization", `Bearer ${userToken}`)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe("Invalid id format on book_id")
    })
    it("should return 400 if score is not a number",async()=>{
        const response = await request(app).post("/api/reviews").send({book_id: usedBookId,score: "asd", content: "good shit"}).set("Authorization", `Bearer ${userToken}`)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe("Invalid score, must be a number")
    })
    
    it("should return 400 if book doesnt exist",async()=>{
        const response = await request(app).post("/api/reviews").send({book_id: "7fdb24bfd2c9eaca400201bf",score: 8, content: "good shit"}).set("Authorization", `Bearer ${userToken}`)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe("Book doesnt exist")
    })
})