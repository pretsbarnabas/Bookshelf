const express = require("express")
const mongoose = require("mongoose")
const routes = require("./routes")
const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express");
import YAML from "yamljs"
import { Logger } from "./tools/logger"
import { ImageController } from "./controllers/image.controller";
const cors = require("cors")


if(process.argv && process.argv.includes("test")){
    require("dotenv").config({path: ".env.test"})
}
else{
    require("dotenv").config()
}

const connectionString = process.env.DATABASE_URL
if(!connectionString){
    Logger.error("No connection string defined")
    throw new Error("No connection string defined")
}

mongoose.connect(connectionString)

const database = mongoose.connection

database.on("error",(error:any)=>{
    Logger.error(error)
})

database.once("connected",()=>{
    Logger.info("Connected to Database")
})


const specs = swaggerJsdoc(YAML.load("./src/swagger.yaml"))

export const app = express()
app.use(cors())
app.use(express.json({limit:"10mb"}))
app.use("/api",routes)

app.use("/api/swagger",swaggerUi.serve,swaggerUi.setup(specs))

app.listen(3000,()=>{
    Logger.info("Server started")
})

ImageController.setup()

module.exports = app