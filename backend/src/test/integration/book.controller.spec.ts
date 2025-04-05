process.argv.push("test")
process.argv.push("jest")
import app from "../../main"
import request from "supertest"


let adminToken: string
let editorToken: string
let newBook: any
describe("Book Controller Post Route Tests",()=>{
    beforeAll(async()=>{
        let response = await request(app).post("/api/login").send({username: "editor", password: "admin"})
        console.log(response.body)
        expect(response.body.token).toBeDefined()
        editorToken = response.body.token

        response = await request(app).post("/api/login").send({username: "admin", password: "admin"})
        console.log(response.body)
        expect(response.body.token).toBeDefined()
        adminToken = response.body.token
        
    })
    it("should post new book with default values and return 201 (auth)",async()=>{
        const response = await request(app).post(`/api/books`).send({title: "Metamorphosis"}).set("Authorization", `Bearer ${editorToken}`)
        expect(response.statusCode).toBe(201)
        expect(response.body).toBeDefined()
        expect(response.body._id).toBeDefined()
        expect(response.body.title).toBeDefined()
        expect(response.body.title).toEqual("Metamorphosis")
        expect(response.body.author).toEqual("Unknown")
        expect(response.body.genre).toEqual("None")
        expect(response.body.description).toEqual("No description added")
        expect(response.body.release).toEqual(null)
    })
    it("should return 401 Unauthorized with no auth",async()=>{
        const response = await request(app).post(`/api/books`).send({title: "Metamorphosis"})
        expect(response.statusCode).toBe(401)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Unauthorized")
    })
    it("should return 400 Bad Request with no title in body",async()=>{
        const response = await request(app).post(`/api/books`)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("title is required")    
    })
    it("should return 400 Bad Request with invalid date on release",async()=>{
        const response = await request(app).post(`/api/books`).send({title: "book", release:"asd"}).set("Authorization", `Bearer ${editorToken}`)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Invalid date")
    })
    it("should create book with all possible parameters",async()=>{
        const response = await request(app).post(`/api/books`).send({title: "Metamorphosis", release:"1915-01-01", author: "Franz Kafka", genre: "Philosophical", description: "description"}).set("Authorization", `Bearer ${editorToken}`)
        expect(response.statusCode).toBe(201)
        expect(response.body).toBeDefined()
        expect(response.body._id).toBeDefined()
        expect(response.body.title).toEqual("Metamorphosis")
        expect(response.body.author).toEqual("Franz Kafka")
        expect(response.body.genre).toEqual("Philosophical")
        expect(response.body.description).toEqual("description")
        expect(response.body.release).toContain("1915-01-01")
        newBook = response.body
    })
    it("should return 400 Bad Request on invalid genre",async()=>{
        const response = await request(app).post(`/api/books`).send({title: "book", genre:"asd"}).set("Authorization", `Bearer ${editorToken}`)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toContain("`asd` is not a valid enum value for path `genre`.")
    })
})

describe("Book Controller Put Route Tests",()=>{
    it("should be able to modify book details with valid token",async()=>{
        const response = await request(app).put(`/api/books/${newBook._id}`).send({title: "Die Verwandlung"}).set("Authorization", `Bearer ${editorToken}`)
        expect(response.statusCode).toBe(200)
        expect(response.body.title).toEqual("Die Verwandlung")
    })
    it("should not be able to modify book details with no auth",async()=>{
        const response = await request(app).put(`/api/books/${newBook._id}`).send({title: "Metamorphosis"})
        expect(response.statusCode).toBe(401)
        expect(response.body.message).toEqual("Unauthorized")
    })
    it("should be able to modify multiple fields at once",async()=>{
        const response = await request(app).put(`/api/books/${newBook._id}`).send({title: "Metamorphosis", release: "1913-01-01"}).set("Authorization", `Bearer ${editorToken}`)
        expect(response.statusCode).toBe(200)
        expect(response.body.title).toEqual("Metamorphosis")
        expect(response.body.release).toContain("1913-01-01")
    })
})

describe("Book Controller Get by Id Route Tests",()=>{
    it("should return book by id",async()=>{
        const response = await request(app).get(`/api/books/${newBook._id}`)
        expect(response.statusCode).toBe(200)
        expect(response.body._id).toEqual(newBook._id)
    })
    it("should return only selected fields",async()=>{
        const response = await request(app).get(`/api/books/${newBook._id}?fields=title`)
        expect(response.statusCode).toBe(200)
        expect(response.body.title).toEqual(newBook.title)
        expect(response.body.author).toBeUndefined()
        expect(response.body._id).toBeUndefined()
    })
    it("should return 404 Not Found if book doesnt exist",async()=>{
        const response = await request(app).get(`/api/books/67a5c3cba3bb48fa646f9639`)
        expect(response.statusCode).toBe(404)
        expect(response.body.message).toEqual("Book not found")
    })
    it("should return 400 Bad Request with no valid fields selected",async()=>{
        const response = await request(app).get(`/api/books/${newBook._id}?fields=asd`)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toEqual("Invalid fields requested")
    })
})

describe("Book Controller Get All Route Tests",()=>{
    it("should return 200 and books with pagecount",async()=>{
        const response = await request(app).get("/api/books")
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.pages).toEqual(1)
        expect(response.body.data.length).toBeGreaterThan(0)
        expect(response.body.data[0].title).toBeDefined()
    })
    it("should return selected fields only",async()=>{
        const response = await request(app).get("/api/books?fields=title,author")
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.data.length).toBeGreaterThan(0)
        expect(response.body.data[0].title).toBeDefined()
        expect(response.body.data[0].author).toBeDefined()
        expect(response.body.data[0].genre).toBeUndefined()
    })
    it("should return books only within selected create range",async()=>{
        const response = await request(app).get("/api/books?minRelease=2015-01-01&maxRelease=2020-01-01")
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.data.length).toBeGreaterThan(0)
        response.body.data.forEach((book:any) => {
            expect(new Date(book.release).getTime()).toBeGreaterThan(new Date("2015-01-01").getTime())
            expect(new Date(book.release).getTime()).toBeLessThan(new Date("2020-01-01").getTime())
        });
    })
    it("should filter on title",async()=>{
        const response = await request(app).get("/api/books?title=meta")
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.data.length).toBeGreaterThan(0)
        response.body.data.forEach((book:any) => {
            expect(book.title.toLowerCase()).toContain("meta")
        });
    })
    it("should filter on author",async()=>{
        const response = await request(app).get("/api/books?author=kafka")
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.data.length).toBeGreaterThan(0)
        response.body.data.forEach((book:any) => {
            expect(book.author.toLowerCase()).toContain("kafka")
        });
    })
    let firstPageBook:any
    it("should only return the request limit of users",async()=>{
        const response = await request(app).get("/api/books?limit=1")
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.data.length).toEqual(1)
        expect(response.body.pages).toBeGreaterThan(1)
        firstPageBook = response.body.data[0]
    })
    it("should return requested page",async()=>{
        const response = await request(app).get("/api/books?limit=1&page=1")
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.data.length).toEqual(1)
        expect(response.body.pages).toBeGreaterThan(1)
        expect(response.body.data[0]).not.toEqual(firstPageBook)
    })
    it("should return 404 when no users match criteria",async()=>{
        const response = await request(app).get("/api/books?minRelease=2025-01-01")
        expect(response.statusCode).toBe(404)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("No books found")
    })
})

describe("Book Controller Delete Route Tests",()=>{
    
    it("should not delete book when not authorized",async()=>{
        const response = await request(app).delete(`/api/books/${newBook._id}`)
        expect(response.statusCode).toBe(401)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Unauthorized")
    })
    it("should delete user when authorized",async()=>{
        const response = await request(app).delete(`/api/books/${newBook._id}`).set("Authorization", `Bearer ${editorToken}`)
        expect(response.statusCode).toBe(200)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Book deleted")
    })
    it("should return invalid id format on bad id",async()=>{
        const response = await request(app).delete(`/api/books/asd`)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Invalid id format")
    })
    it("should return 404 when user doesnt exist (only possible if admin token)",async()=>{
        const response = await request(app).delete(`/api/books/67a5c3cba3bb48fa646f9639`).set("Authorization", `Bearer ${adminToken}`)
        expect(response.statusCode).toBe(404)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Book not found")
    })
})

describe("Book Controller Cascade Deletion Tests",()=>{

    let dependentBookId = "7fdb24bfd2c9eaca400201b8"
    beforeAll(async()=>{
        await request(app).delete(`/api/books/${dependentBookId}`).set("Authorization", `Bearer ${adminToken}`)
    })
    it("should have deleted reviews on deleted book",async()=>{
        const response = await request(app).get(`/api/reviews?book_id=${dependentBookId}`)
        expect(response.statusCode).toBe(404)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("No reviews found")
    })
    it("should have deleted summaries on deleted book",async()=>{
        const response = await request(app).get(`/api/summaries?book_id=${dependentBookId}`)
        expect(response.statusCode).toBe(404)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("No summaries found")
    })
    it("should have removed book from booklists",async()=>{
        const response = await request(app).get("/api/users")
        const pages = response.body.pages
        for (let i = 0; i < pages; i++) {
            const page = await request(app).get("/api/users?fields=booklist")
            page.body.data.forEach((book:any) => {
                expect(book.booklist.book_id).not.toBe(dependentBookId)
            });
        }
    })
})
