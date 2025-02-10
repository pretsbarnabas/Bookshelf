require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const routes = require("./routes.ts")
const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express");
import YAML from "yamljs"
const connectionString = process.env.DATABASE_URL

if(!connectionString) throw new Error("No connection string defined")

mongoose.connect(connectionString)

const database = mongoose.connection

database.on("error",(error:any)=>{
    console.log(error)
})

database.once("connected",()=>{
    console.log("Database connected")
})


const specs = swaggerJsdoc(YAML.load("./src/swagger.yaml"))

const app = express()
app.use(express.json())
app.use("/api",routes)

app.use("/api/swagger",swaggerUi.serve,swaggerUi.setup(specs))

app.listen(3000,()=>{
    console.log("Server started")
})

module.exports = app