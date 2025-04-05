process.argv.push("test")
process.argv.push("jest")
import app from "../../main"
import request from "supertest"

let newUser: any
let newUserToken: string
let adminToken: string
let adminId = "db0b0c1f83fb29f652cc5a2f"
let adminUsername = "admin"

describe("User Controller Post Route Tests",()=>{
    beforeAll(async()=>{
        const response = await request(app).post("/api/login").send({username: "admin", password: "admin"})
        adminToken = response.body.token
    })

    it("should return 201 Created and post new user ",async()=>{
        const response = await request(app).post("/api/users").send({username: "barni", password: "jelszo", email: "barni@mail.com", role: "user"})
        expect(response.statusCode).toBe(201)
        expect(response.body).toBeDefined()
        expect(response.body._id).toBeDefined()
        newUser = response.body 
    })
    it("should return 400 Bad Request with invalid email format",async()=>{
        const response = await request(app).post("/api/users").send({username: "barni", password: "jelszo", email: "barni@", role: "user"})
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Invalid email format")
    })
    it("should return 400 Bad Request with missing body",async()=>{
        const response = await request(app).post("/api/users")
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("username, password, email, role required")
    })
    it("should return 401 Unauthorized when trying to create user with admin role (no auth)",async()=>{
        const response = await request(app).post("/api/users").send({username: "barni", password: "jelszo", email: "barni@mail.com", role: "admin"})
        expect(response.statusCode).toBe(401)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Unauthorized to create user of role admin")
    })
    it("should return 401 Unauthorized when trying to create user with editor role (no auth)",async()=>{
        const response = await request(app).post("/api/users").send({username: "editor", password: "jelszo", email: "barni@editor.com", role: "editor"})
        expect(response.statusCode).toBe(401)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Unauthorized to create user of role editor")
    })
    it("should return 201 Created when trying to create user with editor role (auth)",async()=>{
        const response = await request(app).post("/api/users").send({username: "neweditor", password: "jelszo", email: "barni@editor.com", role: "editor"}).set("Authorization", `Bearer ${adminToken}`)
        expect(response.statusCode).toBe(201)
        expect(response.body._id).toBeDefined()
    })
    it("should return 401 Unauthorized when trying to create user with invalid role (no auth)",async()=>{
        const response = await request(app).post("/api/users").send({username: "barni", password: "jelszo", email: "barni@mail.com", role: "asd"})
        expect(response.statusCode).toBe(401)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Unauthorized to create user of role asd")
    })
    it("should return 400 Bad Request if username already exists",async()=>{
        const response = await request(app).post("/api/users").send({username: "barni", password: "jelszo", email: "barnii@mail.com", role: "user"})
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("username of value barni already exists")
    })
    it("should return 400 Bad Request if email already registered",async()=>{
        const response = await request(app).post("/api/users").send({username: "barnii", password: "jelszo", email: "barni@mail.com", role: "user"})
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("email of value barni@mail.com already exists")
    })

})

describe("User Controller (Auth Controller) Login Route Tests",()=>{
    it("should login with correct details",async()=>{
        const response = await request(app).post("/api/login").send({username: newUser.username, password: "jelszo"})
        expect(response.statusCode).toBe(200)
        expect(response.body.token).toBeDefined()
        newUserToken = response.body.token
    })
    it("should login with admin credentials",async()=>{
        const response = await request(app).post("/api/login").send({username: "admin", password: "admin"})
        expect(response.statusCode).toBe(200)
        expect(response.body.token).toBeDefined()
        adminToken = response.body.token
    
    })
    it("should return 400 Bad Request with missing body",async()=>{
        const response = await request(app).post("/api/login")
        expect(response.statusCode).toBe(400)
    })
    it("should return 403 Forbidden if login details incorrect",async()=>{
        const response = await request(app).post("/api/login").send({username: "asd", password: "asd"})
        expect(response.statusCode).toBe(403)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Invalid username or password")
    })
})

describe("User Controller Put Route Tests",()=>{
    it("should modify user details with valid token",async()=>{
        const response = await request(app).put(`/api/users/${newUser._id}`).send({username: "barnii"}).set("Authorization", `Bearer ${newUserToken}`)
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
        expect(response.body.username).toEqual("barnii")
        newUser.username = response.body.username
    })
    it("should not be able to modify user details with no auth",async()=>{
        const response = await request(app).put(`/api/users/${newUser._id}`).send({username: "barnii"})
        expect(response.statusCode).toBe(401)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Unauthorized")
    })
    it("should modify multiple fields at once",async()=>{
        const response = await request(app).put(`/api/users/${newUser._id}`).send({username: "barni",email: "barna@mail.com"}).set("Authorization", `Bearer ${newUserToken}`)
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
        expect(response.body.username).toEqual("barni")
        expect(response.body.email).toEqual("barna@mail.com")
        newUser.username = response.body.username
        newUser.email = response.body.email
    })
    it("should not be able to modify role if not admin",async()=>{
        const response = await request(app).put(`/api/users/${newUser._id}`).send({role: "admin"}).set("Authorization", `Bearer ${newUserToken}`)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Cannot update role field")
    })
    it("should be able to modify role if admin",async()=>{
        const response = await request(app).put(`/api/users/${newUser._id}`).send({role: "admin"}).set("Authorization", `Bearer ${adminToken}`)
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
        expect(response.body.role).toEqual("admin")
        newUser.role = response.body.role
    })
})

describe("User Controller Get by Id Route Tests",()=>{
    it("should return user by id (no auth)",async()=>{
        const response = await request(app).get(`/api/users/${newUser._id}`)
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
        expect(response.body.username).toEqual(newUser.username)
        expect(response.body.password_hashed).toBeUndefined()
        expect(response.body.email).toBeUndefined()
    })
    it("should return user by id (auth)",async()=>{
        const response = await request(app).get(`/api/users/${newUser._id}`).set("Authorization", `Bearer ${newUserToken}`)
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
        expect(response.body.username).toEqual(newUser.username)
        expect(response.body.password_hashed).toBeUndefined()
        expect(response.body.email).toBeDefined()
        expect(response.body.email).toEqual(newUser.email)
    })
    it("should only return selected fields",async()=>{
        const response = await request(app).get(`/api/users/${newUser._id}?fields=username`)
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
        expect(response.body.username).toBeDefined()
        expect(response.body.role).toBeUndefined()
        expect(response.body.booklist).toBeUndefined()
    })
    it("should return 404 Not found when user with id doesnt exist",async()=>{
        const response = await request(app).get(`/api/users/67a5c3cba3bb48fa646f9639`)
        expect(response.statusCode).toBe(404)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("User not found")
    })
    it("should return 400 bad request with no valid fields selected",async()=>{
        const response = await request(app).get(`/api/users/${newUser._id}?fields=asd`)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Invalid fields requested")
    })
})

describe("User Controller Get All Route Tests",()=>{
    it("should return 200 and users with pagecount",async()=>{
        const response = await request(app).get("/api/users")
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.pages).toEqual(1)
        expect(response.body.data.length).toBeGreaterThan(0)
        expect(response.body.data[0].email).toBeUndefined()
        expect(response.body.data[0].password_hashed).toBeUndefined()
    })
    it("should return email field too when admin auth",async()=>{
        const response = await request(app).get("/api/users").set("Authorization", `Bearer ${adminToken}`)
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.data.length).toBeGreaterThan(0)
        expect(response.body.data[0].email).toBeDefined()    
    })
    it("should return selected fields only",async()=>{
        const response = await request(app).get("/api/users?fields=username,booklist")
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.data.length).toBeGreaterThan(0)
        expect(response.body.data[0].username).toBeDefined()
        expect(response.body.data[0].booklist).toBeDefined()
        expect(response.body.data[0].role).toBeUndefined()
    })
    it("should return users only within selected create range",async()=>{
        const response = await request(app).get("/api/users?minCreate=2015-01-01&maxCreate=2020-01-01")
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.data.length).toBeGreaterThan(0)
        response.body.data.forEach((user:any) => {
            expect(new Date(user.created_at).getTime()).toBeGreaterThan(new Date("2015-01-01").getTime())
            expect(new Date(user.created_at).getTime()).toBeLessThan(new Date("2020-01-01").getTime())
        });
    })
    it("should only return users with selected role",async()=>{
        const response = await request(app).get("/api/users?role=admin")
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.data.length).toBeGreaterThan(0)
        response.body.data.forEach((user:any)=>{
            expect(user.role).toEqual("admin")
        })
    })
    it("should only return users with selected username",async()=>{
        const response = await request(app).get("/api/users?username=admin")
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.data.length).toBeGreaterThan(0)
        response.body.data.forEach((user:any)=>{
            expect(user.username).toContain("admin")
        })
    })
    let firstPageUser:any
    it("should only return the request limit of users",async()=>{
        const response = await request(app).get("/api/users?limit=1")
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.data.length).toEqual(1)
        expect(response.body.pages).toBeGreaterThan(1)
        firstPageUser = response.body.data[0]
    })
    it("should return requested page",async()=>{
        const response = await request(app).get("/api/users?limit=1&page=1")
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.pages).toBeDefined()
        expect(response.body.data.length).toEqual(1)
        expect(response.body.pages).toBeGreaterThan(1)
        expect(response.body.data[0]).not.toEqual(firstPageUser)
    })
    it("should return 404 when no users match criteria",async()=>{
        const response = await request(app).get("/api/users?maxCreate=2010-01-01")
        expect(response.statusCode).toBe(404)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("No users found")
    })
})



describe("User Controller Delete Route Tests",()=>{
    
    it("should not delete user when not authorized",async()=>{
        const response = await request(app).delete(`/api/users/${newUser._id}`)
        expect(response.statusCode).toBe(401)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Unauthorized")
    })
    it("should delete user when authorized",async()=>{
        const response = await request(app).delete(`/api/users/${newUser._id}`).set("Authorization", `Bearer ${newUserToken}`)
        expect(response.statusCode).toBe(200)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("User deleted")
    })
    it("should return invalid id format on bad id",async()=>{
        const response = await request(app).delete(`/api/users/asd`)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("Invalid id format")
    })
    it("should return 404 when user doesnt exist (only possible if admin token)",async()=>{
        const response = await request(app).delete(`/api/users/67a5c3cba3bb48fa646f9639`).set("Authorization", `Bearer ${adminToken}`)
        expect(response.statusCode).toBe(404)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("User not found")
    })
})


let userToDelete = "db0b0c1f83fb29f652cc5a2d"
describe("User Controller Cascade Deletion Tests",()=>{
    beforeAll(async()=>{
        const response = await request(app).delete(`/api/users/${userToDelete}`).set("Authorization", `Bearer ${adminToken}`)
        expect(response.statusCode).toBe(200)
    })
    it("should have delete books made by deleted user",async()=>{
        const response = await request(app).get(`/api/books?user_id=${userToDelete}`)
        expect(response.statusCode).toBe(404)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("No books found")
    })
    it("should have deleted reviews made by deleted user",async()=>{
        const response = await request(app).get(`/api/reviews?user_id=${userToDelete}`)
        expect(response.statusCode).toBe(404)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("No reviews found")
    })
    it("should have deleted comments made by deleted user",async()=>{
        const response = await request(app).get(`/api/comments?user_id=${userToDelete}`)
        expect(response.statusCode).toBe(404)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("No comments found")    
    })
    it("should have deleted summaries made by deleted user",async()=>{
        const response = await request(app).get(`/api/summaries?user_id=${userToDelete}`)
        expect(response.statusCode).toBe(404)
        expect(response.body.message).toBeDefined()
        expect(response.body.message).toEqual("No summaries found")
    })
})