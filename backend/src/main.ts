require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const routes = require("./routes.ts")

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

const app = express()
app.use(express.json())
app.use("/",routes)

app.listen(3000,()=>{
    console.log("Server started")
})

module.exports = app