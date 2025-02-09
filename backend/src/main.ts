require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const routes = require("./routes.ts")
const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express");
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

const options = {
    definition: {
      openapi: "3.1.0",
      info: {
        title: "Bookshelf Backend API",
        version: "0.1.0",
        description:
          "The backend api route descriptions used by Bookshelf",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        }
      },
      servers: [
        {
          url: "http://localhost:3000/",
        },
      ],
    },
    apis: ["./src/routes.ts"],
  };

const specs = swaggerJsdoc(options)

const app = express()
app.use(express.json())
app.use("/api",routes)

app.use("/api/swagger",swaggerUi.serve,swaggerUi.setup(specs))

app.listen(3000,()=>{
    console.log("Server started")
})

module.exports = app