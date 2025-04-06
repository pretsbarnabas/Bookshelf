process.argv.push("test")
process.argv.push("jest")
import app from "../../main"
import request from "supertest"


let adminToken: string
let userToken: string
let newReview: any
let usedBookId = "7fdb24bfd2c9eaca400201b7"
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

describe("Review Controller Put Route Tests",()=>{
    it("should be able to modify review details with valid token",async()=>{
        const response = await request(app).put(`/api/reviews/${newReview._id}`).send({score: 10}).set("Authorization", `Bearer ${userToken}`)
        expect(response.statusCode).toBe(200)
        expect(response.body.score).toEqual(10)
    })
    it("should not be able to modify book details with no auth",async()=>{
        const response = await request(app).put(`/api/reviews/${newReview._id}`).send({score: 10})
        expect(response.statusCode).toBe(401)
        expect(response.body.message).toEqual("Unauthorized")
    })
    it("should be able to modify multiple fields at once",async()=>{
        const response = await request(app).put(`/api/reviews/${newReview._id}`).send({score: 8, content: "modified content"}).set("Authorization", `Bearer ${userToken}`)
        expect(response.statusCode).toBe(200)
        expect(response.body.score).toEqual(8)
        expect(response.body.content).toEqual("modified content")
        newReview.content = response.body.content
    })
    it("should return 400 with bad id format",async()=>{
        const response = await request(app).put("/api/reviews/asd").send({score: 10}).set("Authorization", `Bearer ${userToken}`)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toEqual("Invalid id format")
    })
    it("should return 404 if review doesnt exist",async()=>{
        const response = await request(app).put("/api/reviews/7fdb24bfd2c9eaca400201b7").send({score: 10}).set("Authorization", `Bearer ${userToken}`)
        expect(response.statusCode).toBe(404)
        expect(response.body.message).toEqual("Review not found")
    })
    it("should return 400 if body contains illeagal field",async()=>{
        const response = await request(app).put(`/api/reviews/${newReview._id}`).send({scoree: 10}).set("Authorization", `Bearer ${userToken}`)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toEqual("Cannot update scoree field")
    })
    it("should return 400 if score is not a number",async()=>{
        const response = await request(app).put(`/api/reviews/${newReview._id}`).send({score: "asd"}).set("Authorization", `Bearer ${userToken}`)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toEqual("score must be a number between 1-10")
    })
})

describe("Review Controller Get by Id Route Tests",()=>{
    it("should return review by id",async()=>{
        const response = await request(app).get(`/api/reviews/${newReview._id}`)
        expect(response.statusCode).toBe(200)
        expect(response.body._id).toEqual(newReview._id)
    })
    it("should return only selected fields",async()=>{
        const response = await request(app).get(`/api/reviews/${newReview._id}?fields=content`)
        expect(response.statusCode).toBe(200)
        expect(response.body.content).toEqual(newReview.content)
        expect(response.body.author).toBeUndefined()
        expect(response.body._id).toBeUndefined()
    })
    it("should return 404 Not Found if review doesnt exist",async()=>{
        const response = await request(app).get(`/api/reviews/67a5c3cba3bb48fa646f9639`)
        expect(response.statusCode).toBe(404)
        expect(response.body.message).toEqual("Review not found")
    })
    it("should return 400 Bad Request with no valid fields selected",async()=>{
        const response = await request(app).get(`/api/reviews/${newReview._id}?fields=asd`)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toEqual("Invalid fields requested")
    })
})

describe("Review Controller Get All Route Tests",()=>{
    it("should return 200 and reviews with pagecount",async()=>{
        const response = await request(app).get("/api/reviews")
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.pages).toEqual(1)
        expect(response.body.data.length).toBeGreaterThan(0)
        expect(response.body.data[0].content).toBeDefined()
    })
    it("should return selected fields only",async()=>{
        const response = await request(app).get("/api/reviews?fields=content")
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.data.length).toBeGreaterThan(0)
        expect(response.body.data[0].content).toBeDefined()
        expect(response.body.data[0].score).toBeUndefined()
        expect(response.body.data[0]._id).toBeUndefined()
    })
    it("should return reviews only within selected create range",async()=>{
        const response = await request(app).get("/api/reviews?minCreate=2015-01-01&maxCreate=2020-01-01")
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.data.length).toBeGreaterThan(0)
        response.body.data.forEach((review:any) => {
            expect(new Date(review.created_at).getTime()).toBeGreaterThan(new Date("2015-01-01").getTime())
            expect(new Date(review.created_at).getTime()).toBeLessThan(new Date("2020-01-01").getTime())
        });
    })
    it("should filter on user_id",async()=>{
        const response = await request(app).get(`/api/reviews?user_id=db0b0c1f83fb29f652cc5a2c`)
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.data.length).toBeGreaterThan(0)
        response.body.data.forEach((review:any) => {
            expect(review.user._id).toBe("db0b0c1f83fb29f652cc5a2c")
        });
    })
    it("should filter on book_id",async()=>{
        const response = await request(app).get(`/api/reviews?book_id=${usedBookId}`)
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.data.length).toBeGreaterThan(0)
        response.body.data.forEach((review:any) => {
            expect(review.book._id).toBe(usedBookId)
        });
    })
    it("should filter on score",async()=>{
        const response = await request(app).get(`/api/reviews?score=8`)
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.data.length).toBeGreaterThan(0)
        response.body.data.forEach((review:any) => {
            expect(review.score).toBe(8)
        });
    })
    let firstPageReview:any
    it("should only return the request limit of reviews",async()=>{
        const response = await request(app).get("/api/reviews?limit=1")
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.data.length).toEqual(1)
        expect(response.body.pages).toBeGreaterThan(1)
        firstPageReview = response.body.data[0]
    })
    it("should return requested page",async()=>{
        const response = await request(app).get("/api/reviews?limit=1&page=1")
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.data.length).toEqual(1)
        expect(response.body.pages).toBeGreaterThan(1)
        expect(response.body.data[0]).not.toEqual(firstPageReview)
    })
    it("should return 404 when no reviews match criteria",async()=>{
        const response = await request(app).get("/api/reviews?minCreate=2100-01-01")
        expect(response.statusCode).toBe(404)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("No reviews found")
    })
    it("should return 400 when score is not a number",async()=>{
        const response = await request(app).get("/api/reviews?score=asd")
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Invalid score")
    })
    it("should return 400 when score is less than 1",async()=>{
        const response = await request(app).get("/api/reviews?score=0")
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Invalid score")
    })
    it("should return 400 when score is more than 10",async()=>{
        const response = await request(app).get("/api/reviews?score=11")
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Invalid score")
    })
    it("should return 400 when limit is less than 1",async()=>{
        const response = await request(app).get("/api/reviews?limit=0")
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Invalid page or limit")
    })
    it("should return 400 when limit is not a number",async()=>{
        const response = await request(app).get("/api/reviews?limit=asd")
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Invalid page or limit")
    })
    it("should return 400 when page is less than 0",async()=>{
        const response = await request(app).get("/api/reviews?page=-1")
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Invalid page or limit")
    })
    it("should return 400 when page is not a number",async()=>{
        const response = await request(app).get("/api/reviews?page=asd")
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Invalid page or limit")
    })
})

describe("Review Controller Delete Route Tests",()=>{
    
    it("should not delete review when not authorized",async()=>{
        const response = await request(app).delete(`/api/reviews/${newReview._id}`)
        expect(response.statusCode).toBe(401)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Unauthorized")
    })
    it("should delete review when authorized",async()=>{
        const response = await request(app).delete(`/api/reviews/${newReview._id}`).set("Authorization", `Bearer ${userToken}`)
        expect(response.statusCode).toBe(200)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Review deleted")
    })
    it("should return invalid id format on bad id",async()=>{
        const response = await request(app).delete(`/api/reviews/asd`)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Invalid id format")
    })
    it("should return 404 when review doesnt exist (only possible if admin token)",async()=>{
        const response = await request(app).delete(`/api/reviews/67a5c3cba3bb48fa646f9639`).set("Authorization", `Bearer ${adminToken}`)
        expect(response.statusCode).toBe(404)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Review not found")
    })
})

describe("Review Controller Cascade Deletion Tests",()=>{

    let dependentReviewId = "a826b9febba8c411cf6d82cf"
    beforeAll(async()=>{
        await request(app).delete(`/api/reviews/${dependentReviewId}`).set("Authorization", `Bearer ${adminToken}`)
    })
    it("should have deleted comments on deleted book",async()=>{
        const response = await request(app).get(`/api/comments?review_id=${dependentReviewId}`)
        expect(response.statusCode).toBe(404)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("No comments found")
    })
})