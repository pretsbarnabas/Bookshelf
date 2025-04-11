process.argv.push("test")
process.argv.push("jest")
import app from "../../main"
import request from "supertest"


let adminToken: string
let editorToken: string
let newSummary: any
let usedBookId = "7fdb24bfd2c9eaca400201b1"

describe("Summary Controller Post Route Tests",()=>{
    beforeAll(async()=>{
        let response = await request(app).post("/api/login").send({username: "admin", password: "admin"})
        console.log(response.body)
        expect(response.body.token).toBeDefined()
        adminToken = response.body.token

        response = await request(app).post("/api/login").send({username: "editor", password: "admin"})
        console.log(response.body)
        expect(response.body.token).toBeDefined()
        editorToken = response.body.token
        
    })

    it("should post new summary with correct body and auth",async()=>{
        const response = await request(app).post("/api/summaries").send({book_id: usedBookId, content: "good shit"}).set("Authorization", `Bearer ${editorToken}`)
        expect(response.statusCode).toBe(201)
        expect(response.body._id).toBeDefined()
        expect(response.body.book_id).toBe(usedBookId)
        expect(response.body.content).toBe("good shit")
        newSummary = response.body
    })

    it("should return 401 with no auth",async()=>{
        const response = await request(app).post("/api/summaries").send({book_id: usedBookId, content: "good shit"})
        expect(response.statusCode).toBe(401)
        expect(response.body.message).toBe("Unauthorized")
    })

    it("should return 400 with missing book_id",async()=>{
        const response = await request(app).post("/api/summaries").send({ content: "good shit"}).set("Authorization", `Bearer ${editorToken}`)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe("book_id is required")
    })
    it("should return 400 with missing content",async()=>{
        const response = await request(app).post("/api/summaries").send({book_id: usedBookId}).set("Authorization", `Bearer ${editorToken}`)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe("content is required")
    })
    it("should return 400 with bad id format on book_id",async()=>{
        const response = await request(app).post("/api/summaries").send({book_id: "asd", content: "good shit"}).set("Authorization", `Bearer ${editorToken}`)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe("Invalid id format on book_id")
    })
    it("should return 400 if review doesnt exist",async()=>{
        const response = await request(app).post("/api/summaries").send({book_id: "7fdb24bfd2c9eaca400201bf", content: "good shit"}).set("Authorization", `Bearer ${editorToken}`)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe("Book doesnt exist")
    })
})

describe("Summary Controller Put Route Tests",()=>{
    it("should be able to modify summary details with valid token",async()=>{
        const response = await request(app).put(`/api/summaries/${newSummary._id}`).send({content: "fenomenal"}).set("Authorization", `Bearer ${editorToken}`)
        expect(response.statusCode).toBe(200)
        expect(response.body.content).toEqual("fenomenal")
        newSummary.content = response.body.content
    })
    it("should not be able to modify summary details with no auth",async()=>{
        const response = await request(app).put(`/api/summaries/${newSummary._id}`).send({content: "asd"})
        expect(response.statusCode).toBe(401)
        expect(response.body.message).toEqual("Unauthorized")
    })
    it("should return 400 with bad id format",async()=>{
        const response = await request(app).put("/api/summaries/asd").send({content: "asd"}).set("Authorization", `Bearer ${editorToken}`)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toEqual("Invalid id format")
    })
    it("should return 404 if comment doesnt exist",async()=>{
        const response = await request(app).put("/api/summaries/7fdb24bfd2c9eaca400201b7").send({content:"asd"}).set("Authorization", `Bearer ${editorToken}`)
        expect(response.statusCode).toBe(404)
        expect(response.body.message).toEqual("Summary not found")
    })
})

describe("Summary Controller Get by Id Route Tests",()=>{
    it("should return summary by id",async()=>{
        const response = await request(app).get(`/api/summaries/${newSummary._id}`)
        expect(response.statusCode).toBe(200)
        expect(response.body._id).toEqual(newSummary._id)
    })
    it("should return only selected fields",async()=>{
        const response = await request(app).get(`/api/summaries/${newSummary._id}?fields=content`)
        expect(response.statusCode).toBe(200)
        expect(response.body.content).toEqual(newSummary.content)
        expect(response.body.user).toBeUndefined()
        expect(response.body._id).toBeUndefined()
    })
    it("should return 404 Not Found if summary doesnt exist",async()=>{
        const response = await request(app).get(`/api/summaries/67a5c3cba3bb48fa646f9639`)
        expect(response.statusCode).toBe(404)
        expect(response.body.message).toEqual("Summary not found")
    })
    it("should return 400 Bad Request with no valid fields selected",async()=>{
        const response = await request(app).get(`/api/summaries/${newSummary._id}?fields=asd`)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toEqual("Invalid fields requested")
    })
})

describe("Summary Controller Get All Route Tests",()=>{
    it("should return 200 and summaries with pagecount",async()=>{
        const response = await request(app).get("/api/summaries")
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.pages).toEqual(1)
        expect(response.body.data.length).toBeGreaterThan(0)
        expect(response.body.data[0].content).toBeDefined()
    })
    it("should return selected fields only",async()=>{
        const response = await request(app).get("/api/summaries?fields=content")
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.data.length).toBeGreaterThan(0)
        expect(response.body.data[0].content).toBeDefined()
        expect(response.body.data[0].user).toBeUndefined()
        expect(response.body.data[0]._id).toBeUndefined()
    })
    it("should return summaries only within selected create range",async()=>{
        const response = await request(app).get("/api/summaries?minCreate=2015-01-01&maxCreate=2020-01-01")
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.data.length).toBeGreaterThan(0)
        response.body.data.forEach((summary:any) => {
            expect(new Date(summary.created_at).getTime()).toBeGreaterThan(new Date("2015-01-01").getTime())
            expect(new Date(summary.created_at).getTime()).toBeLessThan(new Date("2020-01-01").getTime())
        });
    })
    it("should filter on user_id",async()=>{
        const response = await request(app).get(`/api/summaries?user_id=db0b0c1f83fb29f652cc5a2c`)
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.data.length).toBeGreaterThan(0)
        response.body.data.forEach((summary:any) => {
            expect(summary.user._id).toBe("db0b0c1f83fb29f652cc5a2c")
        });
    })
    it("should filter on book_id",async()=>{
        const response = await request(app).get(`/api/summaries?book_id=${usedBookId}`)
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.data.length).toBeGreaterThan(0)
        response.body.data.forEach((comment:any) => {
            expect(comment.book._id).toBe(usedBookId)
        });
    })
    let firstPageSummary:any
    it("should only return the request limit of summaries",async()=>{
        const response = await request(app).get("/api/summaries?limit=1")
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.data.length).toEqual(1)
        expect(response.body.pages).toBeGreaterThan(1)
        firstPageSummary = response.body.data[0]
    })
    it("should return requested page",async()=>{
        const response = await request(app).get("/api/summaries?limit=1&page=1")
        console.log(response.body)
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.data.length).toEqual(1)
        expect(response.body.pages).toBeGreaterThan(1)
        expect(response.body.data[0]).not.toEqual(firstPageSummary)
    })
    it("should return 404 when no summaries match criteria",async()=>{
        const response = await request(app).get("/api/summaries?minCreate=2100-01-01")
        expect(response.statusCode).toBe(404)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("No summaries found")
    })
    it("should return 400 when limit is less than 1",async()=>{
        const response = await request(app).get("/api/summaries?limit=0")
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Invalid page or limit")
    })
    it("should return 400 when limit is not a number",async()=>{
        const response = await request(app).get("/api/summaries?limit=asd")
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Invalid page or limit")
    })
    it("should return 400 when page is less than 0",async()=>{
        const response = await request(app).get("/api/summaries?page=-1")
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Invalid page or limit")
    })
    it("should return 400 when page is not a number",async()=>{
        const response = await request(app).get("/api/summaries?page=asd")
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Invalid page or limit")
    })
})

describe("Summary Controller Delete Route Tests",()=>{
    
    it("should not delete summary when not authorized",async()=>{
        const response = await request(app).delete(`/api/summaries/${newSummary._id}`)
        expect(response.statusCode).toBe(401)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Unauthorized")
    })
    it("should delete summary when authorized",async()=>{
        const response = await request(app).delete(`/api/summaries/${newSummary._id}`).set("Authorization", `Bearer ${editorToken}`)
        expect(response.statusCode).toBe(200)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Summary deleted")
    })
    it("should return invalid id format on bad id",async()=>{
        const response = await request(app).delete(`/api/summaries/asd`)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Invalid id format")
    })
    it("should return 404 when summary doesnt exist (only possible if admin token)",async()=>{
        const response = await request(app).delete(`/api/summaries/67a5c3cba3bb48fa646f9639`).set("Authorization", `Bearer ${adminToken}`)
        expect(response.statusCode).toBe(404)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Summary not found")
    })
})