const UserModel = require("../models/user.model")
const ReviewModel = require("../models/review.model")
const CommentModel = require("../models/comment.model")

import * as dates from "../tools/dates"
import * as validators from "../tools/validators"
import {Projection} from "../models/projection.model"
import mongoose from "mongoose"
import { Logger } from "../tools/logger"
import { Authenticator } from "./auth.controller"
import { ErrorHandler } from "../tools/errorhandler"
import { ImageController } from "./image.controller"

export class UserController{


  
    static async getAllUsers(req:any,res:any){
        try{
            let {username, email, minCreate, maxCreate, minUpdate, maxUpdate, role, fields, page = 0, limit = 10} = req.query

            limit = Number.parseInt(limit)
            page = Number.parseInt(page)
            
            if(Number.isNaN(limit) || Number.isNaN(page) || limit < 1 || page < 0){
                Logger.info("Invalid page or limit requested")
                return res.status(400).json({error:"Invalid page or limit"})
            }

            const allowedFields = ["_id","username","role","created_at","updated_at","booklist","last_login","imageUrl"]

            let filters: {username?:RegExp,email?:RegExp,role?:string} = {}

            if(username) filters.username = new RegExp(`${username}`,"i")
            if(email) filters.email = new RegExp(`${email}`,"i")
            if(role) filters.role = role
            
            if(!minCreate) minCreate = dates.minDate()
            if(!maxCreate) maxCreate = dates.maxDate()
            if(!minUpdate) minUpdate = dates.minDate()
            if(!maxUpdate) maxUpdate = dates.maxDate()

            if(!validators.isValidISODate(minCreate)|| !validators.isValidISODate(maxCreate)){
                Logger.info(`Invalid date requested\nminCreate: ${minCreate}\nmaxCreate: ${maxCreate}`)
                return res.status(400).json({error:"Invalid create date requested"})
            }
            if(!validators.isValidISODate(minUpdate) || !validators.isValidISODate(maxUpdate)){
                Logger.info(`Invalid date requested\nminUpdate: ${minUpdate}\nmaxUpdate: ${maxUpdate}`)
                return res.status(400).json({error:"Invalid update date requested"})
            }

            const requestedFields: string[] = fields ? fields.split(",") : allowedFields
            const validFields: string[] = requestedFields.filter(field =>allowedFields.includes(field))

            if(validFields.length === 0){
                Logger.info("Invalid fields requested")
                return res.status(400).json({error:"Invalid fields requested"})
            }

            if(!validFields.includes("_id")) validFields.push("-_id")

            const projection: Projection = validFields.reduce((acc: Projection,field)=>{
                acc[field] = 1
                return acc
            }, {"_id": 0} as Projection)



            const users = await UserModel.aggregate([
                {$match: filters},
                {
                    $match: {
                      $and: [
                        {
                          $expr: {
                            $gte: ["$created_at", new Date(minCreate)]
                          }
                        },
                        {
                          $expr: {
                            $lte: ["$created_at", new Date(maxCreate)]
                          }
                        },
                        {
                          $expr: {
                            $gte: ["$updated_at", new Date(minUpdate)]
                          }
                        },
                        {
                          $expr: {
                            $lte: ["$updated_at", new Date(maxUpdate)]
                          }
                        }
                      ]
                    }
                },
                {$project: projection},
                {$skip: page*limit},
                {$limit: limit}
            ])
            if(users){
                Logger.info("Request handled")
                res.status(200).json(users)
            }
        }catch(error:any){
            ErrorHandler.HandleMongooseErrors(error,res)
        }
    }

    static async getUserById(req:any,res:any){
        try{
            const {id} = req.params
            const {fields} = req.query
            let allowedFields = ["_id","username","created_at","updated_at","last_login","role","booklist","imageUrl"]
            
            if(Authenticator.verifyUser(req,id)){
                allowedFields.push("email", "password_hashed")
            }


            const requestedFields: string[] = fields ? fields.split(",") : allowedFields
            const validFields: string[] = requestedFields.filter(field =>allowedFields.includes(field))
            
            if(validFields.length === 0){
                Logger.info("Invalid fields requested")
                return res.status(400).json({error:"Invalid fields requested"})
            }
            
            if(!validFields.includes("_id")) validFields.push("-_id")

            const data = await UserModel.findById(id).select(validFields)
            if(data){
                Logger.info("Request handled")
                res.status(200).json(data)
            }
            else{
                Logger.info("Requested user not found")
                res.status(404).json({message: "User not found"})
            }
        }catch(error:any){
            ErrorHandler.HandleMongooseErrors(error,res)
        }
    }

    static async createUser(req:any,res:any){
        try{
            const {username, image ,password, email, role} = req.body

            if(!username || !password || !email || !role){
                Logger.info("Missing body parameters, request not handled")
                return res.status(400).json({message: "username, password, email, role required"})
            }
            if(role !== "user"){
                if(!Authenticator.verifyUser(req,"",["admin"])){
                    Logger.warn("Unathorized use of creation")
                    return res.status(401).json({message: `Unauthorized to create user of role ${role}`})
                }
            }
            if(!validators.IsValidEmail(email)) return res.status(400).json({message: "Invalid email format"})

            const hashed_password = await Authenticator.hashPassword(password)
            const newUser = new UserModel({
                username: username,
                password_hashed: hashed_password,
                email: email,
                role: role
            })
            if(image){
                req.body.imageName = `user-${newUser._id}`
                req.body.imageData = image
                const newImageName = ImageController.uploadImage(req,res)
                if(!newImageName) return
                const newImageUrl = `${ImageController.currentUrl}/image/${newImageName}`
                newUser.imageUrl = newImageUrl
                await newUser.save()
            }
            Logger.info(`New user created: ${newUser._id}`)
            await newUser.save()
            res.status(201).json(newUser)
        }catch(error:any){
            ErrorHandler.HandleMongooseErrors(error,res)
        }
    }
    
    static async deleteUser(req:any,res:any){
        try{
            const {id} = req.params
            if(id){
                if(!mongoose.Types.ObjectId.isValid(id)){
                    return res.status(400).json({message: "Invalid id format"})
                }
            }
            else{
                return res.status(400).json({message: "id is required"})
            }
            if(!Authenticator.verifyUser(req,id)) return res.json(401).send()
            const data = await UserModel.findByIdAndDelete(id)
            if(!data){
                res.status(404).json({message:"User not found"})
                
            }
            else{
                res.status(200).json({message:"User deleted"})
                Logger.info(`User deleted: ${id}`)
                const deletedReviews = await ReviewModel.deleteMany({user_id: id})
                if(deletedReviews.deletedCount) Logger.info(`Deleted ${deletedReviews.deletedCount} reviews of user: ${id}`)
                const deletedComments = await CommentModel.deleteMany({user_id: id})
                if(deletedComments.deletedCount) Logger.info(`Deleted ${deletedComments.deletedCount} comments of user: ${id}`)

                if(data.imageUrl) ImageController.deleteImage(data.imageUrl.split("/").pop())
            }
            
        }
        catch(error:any){
            res.status(500).json({message:error.message})
        }
    }
    
    static async updateUser(req:any,res:any){
        try{
            const {id} = req.params
            if(id){
                if(!mongoose.Types.ObjectId.isValid(id)){
                    return res.status(400).json({message: "Invalid id format"})
                }
            }
            else{
                return res.status(400).json({message: "id is required"})
            }
            if(!Authenticator.verifyUser(req,id)) return res.status(401).json({message: "Unauthorized"})
                const user = await UserModel.findById(id)
            const updates = req.body
            const allowedFields = ["username","password","email","booklist","image"]
            if(!user) return res.status(404).json({message: "User not found"})
            for (const key of Object.keys(updates)) {
                if (!allowedFields.includes(key)) {
                    return res.status(400).json({ message: `Cannot update ${key} field` });
                }
                if (key === "email") {
                    if (!validators.IsValidEmail(updates[key])) {
                        return res.status(400).json({ message: "Invalid email format" });
                    }
                } 
                if(key === "image"){
                    req.body.imageName = `user-${user._id}`
                    req.body.imageData = updates["image"]
                    const newImageName = ImageController.uploadImage(req,res)
                    if(!newImageName) return
                    const newImageUrl = `${ImageController.currentUrl}/image/${newImageName}`
                    user["imageUrl"] = newImageUrl
                }
                else if (key === "password") {
                    const newPassHash = await Authenticator.hashPassword(updates[key]);
                    user["password_hashed"] = newPassHash;
                }
                else {
                    user[key] = updates[key];
                }
            }
            user._updateContext = "update"
            await user.save()
            return res.status(200).json({user:user})
        }
        catch(error:any){
            ErrorHandler.HandleMongooseErrors(error,res)
        }
    }
}
