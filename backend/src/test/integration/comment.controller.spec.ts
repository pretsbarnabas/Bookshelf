process.argv.push("test")
process.argv.push("jest")
import app from "../../main"
import request from "supertest"


let adminToken: string
let userToken: string
let newComment: any
let usedReviewId = "a826b9febba8c411cf6d82cd"

describe("Comment Controller Post Route Tests",()=>{
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
        const response = await request(app).post("/api/comments").send({review_id: usedReviewId, content: "good shit"}).set("Authorization", `Bearer ${userToken}`)
        expect(response.statusCode).toBe(201)
        expect(response.body._id).toBeDefined()
        expect(response.body.review_id).toBe(usedReviewId)
        expect(response.body.content).toBe("good shit")
        newComment = response.body
    })

    it("should return 401 with no auth",async()=>{
        const response = await request(app).post("/api/comments").send({review_id: usedReviewId, content: "good shit"})
        expect(response.statusCode).toBe(401)
        expect(response.body.message).toBe("Unauthorized")
    })

    it("should return 400 with missing review_id",async()=>{
        const response = await request(app).post("/api/comments").send({ content: "good shit"}).set("Authorization", `Bearer ${userToken}`)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe("review_id is required")
    })
    it("should return 400 with missing content",async()=>{
        const response = await request(app).post("/api/comments").send({review_id: usedReviewId}).set("Authorization", `Bearer ${userToken}`)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe("content is required")
    })
    it("should return 400 with bad id format on review_id",async()=>{
        const response = await request(app).post("/api/comments").send({review_id: "asd", content: "good shit"}).set("Authorization", `Bearer ${userToken}`)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe("Invalid id format on review_id")
    })
    it("should return 400 if review doesnt exist",async()=>{
        const response = await request(app).post("/api/comments").send({review_id: "7fdb24bfd2c9eaca400201bf", content: "good shit"}).set("Authorization", `Bearer ${userToken}`)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe("Review doesnt exist")
    })
})

describe("Comment Controller Put Route Tests",()=>{
    it("should be able to modify comment details with valid token",async()=>{
        const response = await request(app).put(`/api/comments/${newComment._id}`).send({content: "illiterate"}).set("Authorization", `Bearer ${userToken}`)
        expect(response.statusCode).toBe(200)
        expect(response.body.content).toEqual("illiterate")
        newComment.content = response.body.content
    })
    it("should not be able to modify comment details with no auth",async()=>{
        const response = await request(app).put(`/api/comments/${newComment._id}`).send({content: "asd"})
        expect(response.statusCode).toBe(401)
        expect(response.body.message).toEqual("Unauthorized")
    })
    it("should return 400 with bad id format",async()=>{
        const response = await request(app).put("/api/comments/asd").send({content: "asd"}).set("Authorization", `Bearer ${userToken}`)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toEqual("Invalid id format")
    })
    it("should return 404 if comment doesnt exist",async()=>{
        const response = await request(app).put("/api/comments/7fdb24bfd2c9eaca400201b7").send({content:"asd"}).set("Authorization", `Bearer ${userToken}`)
        expect(response.statusCode).toBe(404)
        expect(response.body.message).toEqual("Comment not found")
    })
})

describe("Comment Controller Get by Id Route Tests",()=>{
    it("should return comment by id",async()=>{
        const response = await request(app).get(`/api/comments/${newComment._id}`)
        expect(response.statusCode).toBe(200)
        expect(response.body._id).toEqual(newComment._id)
    })
    it("should return only selected fields",async()=>{
        const response = await request(app).get(`/api/comments/${newComment._id}?fields=content`)
        expect(response.statusCode).toBe(200)
        expect(response.body.content).toEqual(newComment.content)
        expect(response.body.user).toBeUndefined()
        expect(response.body._id).toBeUndefined()
    })
    it("should return 404 Not Found if comment doesnt exist",async()=>{
        const response = await request(app).get(`/api/comments/67a5c3cba3bb48fa646f9639`)
        expect(response.statusCode).toBe(404)
        expect(response.body.message).toEqual("Comment not found")
    })
    it("should return 400 Bad Request with no valid fields selected",async()=>{
        const response = await request(app).get(`/api/comments/${newComment._id}?fields=asd`)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toEqual("Invalid fields requested")
    })
})

describe("Comment Controller Get All Route Tests",()=>{
    it("should return 200 and comments with pagecount",async()=>{
        const response = await request(app).get("/api/comments")
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.pages).toEqual(1)
        expect(response.body.data.length).toBeGreaterThan(0)
        expect(response.body.data[0].content).toBeDefined()
    })
    it("should return selected fields only",async()=>{
        const response = await request(app).get("/api/comments?fields=content")
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.data.length).toBeGreaterThan(0)
        expect(response.body.data[0].content).toBeDefined()
        expect(response.body.data[0].user).toBeUndefined()
        expect(response.body.data[0]._id).toBeUndefined()
    })
    it("should return comments only within selected create range",async()=>{
        const response = await request(app).get("/api/comments?minCreate=2015-01-01&maxCreate=2020-01-01")
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.data.length).toBeGreaterThan(0)
        response.body.data.forEach((comment:any) => {
            expect(new Date(comment.created_at).getTime()).toBeGreaterThan(new Date("2015-01-01").getTime())
            expect(new Date(comment.created_at).getTime()).toBeLessThan(new Date("2020-01-01").getTime())
        });
    })
    it("should filter on user_id",async()=>{
        const response = await request(app).get(`/api/comments?user_id=db0b0c1f83fb29f652cc5a2c`)
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.data.length).toBeGreaterThan(0)
        response.body.data.forEach((comment:any) => {
            expect(comment.user._id).toBe("db0b0c1f83fb29f652cc5a2c")
        });
    })
    it("should filter on review_id",async()=>{
        const response = await request(app).get(`/api/comments?review_id=${usedReviewId}`)
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.data.length).toBeGreaterThan(0)
        response.body.data.forEach((comment:any) => {
            expect(comment.review._id).toBe(usedReviewId)
        });
    })
    let firstPageComment:any
    it("should only return the request limit of comments",async()=>{
        const response = await request(app).get("/api/comments?limit=1")
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.data.length).toEqual(1)
        expect(response.body.pages).toBeGreaterThan(1)
        firstPageComment = response.body.data[0]
    })
    it("should return requested page",async()=>{
        const response = await request(app).get("/api/comments?limit=1&page=1")
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.data.length).toEqual(1)
        expect(response.body.pages).toBeGreaterThan(1)
        expect(response.body.data[0]).not.toEqual(firstPageComment)
    })
    it("should return 404 when no comments match criteria",async()=>{
        const response = await request(app).get("/api/comments?minCreate=2100-01-01")
        expect(response.statusCode).toBe(404)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("No comments found")
    })
    it("should return 400 when limit is less than 1",async()=>{
        const response = await request(app).get("/api/comments?limit=0")
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Invalid page or limit")
    })
    it("should return 400 when limit is not a number",async()=>{
        const response = await request(app).get("/api/comments?limit=asd")
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Invalid page or limit")
    })
    it("should return 400 when page is less than 0",async()=>{
        const response = await request(app).get("/api/comments?page=-1")
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Invalid page or limit")
    })
    it("should return 400 when page is not a number",async()=>{
        const response = await request(app).get("/api/comments?page=asd")
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Invalid page or limit")
    })
})

describe("Comment Controller Delete Route Tests",()=>{
    
    it("should not delete comment when not authorized",async()=>{
        const response = await request(app).delete(`/api/comments/${newComment._id}`)
        expect(response.statusCode).toBe(401)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Unauthorized")
    })
    it("should delete comment when authorized",async()=>{
        const response = await request(app).delete(`/api/comments/${newComment._id}`).set("Authorization", `Bearer ${userToken}`)
        expect(response.statusCode).toBe(200)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Comment deleted")
    })
    it("should return invalid id format on bad id",async()=>{
        const response = await request(app).delete(`/api/comments/asd`)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Invalid id format")
    })
    it("should return 404 when comment doesnt exist (only possible if admin token)",async()=>{
        const response = await request(app).delete(`/api/comments/67a5c3cba3bb48fa646f9639`).set("Authorization", `Bearer ${adminToken}`)
        expect(response.statusCode).toBe(404)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Comment not found")
    })
})