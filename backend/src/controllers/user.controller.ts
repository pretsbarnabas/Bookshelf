const UserModel = require("../models/user.model")
const ReviewModel = require("../models/review.model")
const CommentModel = require("../models/comment.model")
const BookModel = require("../models/book.model")

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

            const allowedFields = ["_id","username","role","created_at","updated_at","last_login","imageUrl", "booklist"]
            if(Authenticator.verifyUser(req)){
                allowedFields.push("email")
            }

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
                return res.status(400).json({message:"Invalid create date requested"})
            }
            if(!validators.isValidISODate(minUpdate) || !validators.isValidISODate(maxUpdate)){
                Logger.info(`Invalid date requested\nminUpdate: ${minUpdate}\nmaxUpdate: ${maxUpdate}`)
                return res.status(400).json({message:"Invalid update date requested"})
            }

            const requestedFields: string[] = fields ? fields.split(",") : allowedFields
            const validFields: string[] = requestedFields.filter(field =>allowedFields.includes(field))

            if(validFields.length === 0){
                Logger.info("Invalid fields requested")
                return res.status(400).json({message:"Invalid fields requested"})
            }

            if(!validFields.includes("_id")) validFields.push("-_id")

            const projection: Projection = validFields.reduce((acc: Projection,field)=>{
                acc[field] = 1
                return acc
            }, {"_id": 0} as Projection)



            const data = await UserModel.aggregate([
                {
                  $match: {
                    $and: [
                      filters,
                      {
                        created_at: { $gte: new Date(minCreate), $lte: new Date(maxCreate) },
                        updated_at: { $gte: new Date(minUpdate), $lte: new Date(maxUpdate) }
                      }
                    ]
                  }
                },
                {$facet:{
                    data: [
                        {$skip: page*limit},
                        {$limit: limit},
                        {$project: projection}
                    ],
                    count:[{$count:"count"}]
                }},
                {$project:{data: 1, count: {$arrayElemAt: ["$count",0]}}}
              ]);
            let users = data[0]
            if(users && users.data && users.data.length){
                const pages = Math.ceil(Number.parseInt(users.count.count) / limit)

                Logger.info("Request handled")
                return res.status(200).json({data: users.data, pages: pages})
            }
            else{
                Logger.warn("No users found")
                return res.status(404).json({message: "No users found"})
            }
        }catch(error:any){
            ErrorHandler.HandleMongooseErrors(error,res)
        }
    }

    static async getUserById(req:any,res:any){
        try{
            const {id} = req.params
            const {fields} = req.query
            let allowedFields = ["_id","username","role","created_at","updated_at","last_login","imageUrl","booklist.read_status", "booklist.book.title", "booklist.book._id", "booklist.book.imageUrl", "booklist.book.author"]

            
            if(Authenticator.verifyUser(req,id)){
                allowedFields.push("email")
            }



            const requestedFields: string[] = fields ? fields.split(",") : allowedFields
            const validFields: string[] = requestedFields.filter(field =>allowedFields.includes(field))
            
            if(validFields.length === 0){
                Logger.info("Invalid fields requested")
                return res.status(400).json({message:"Invalid fields requested"})
            }
            
            if(!validFields.includes("_id")) validFields.push("-_id")

            const projection: Projection = validFields.reduce((acc: Projection,field)=>{
                acc[field] = 1
                return acc
            }, {"_id": 0} as Projection)


            const potUser = await UserModel.findById(id).select(projection)
            if(!potUser){
                return res.status(404).json({message: "User not found"})
            }
            if(!potUser.booklist ||!potUser.booklist.length){
                return res.status(200).json(potUser)
            }
            const data = await UserModel.aggregate([         
                { $match: {_id: new mongoose.Types.ObjectId(id as string)}},         
                { $unwind: "$booklist" },
                {
                  $lookup: {
                    from: "books",
                    localField: "booklist.book_id",
                    foreignField: "_id",
                    as: "booklist.book"
                  }
                },
                { $unwind: "$booklist.book" },
                
                {
                  $group: {
                    _id: "$_id",
                    root: { $first: "$$ROOT" },
                    booklist: { $push: "$booklist" }
                  }
                },
                {
                  $replaceRoot: {
                    newRoot: {
                      $mergeObjects: [
                        "$root",
                        { booklist: "$booklist" }
                      ]
                    }
                  }
                },
                
                {$project: projection},
              ]);
            if(data && data.length){
                Logger.info("Request handled")
                res.status(200).json(data[0])
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
                try {
                    newUser.imageUrl = await ImageController.uploadToCloudinary(req.body.image);
                  } catch (uploadError) {
                    return res.status(400).json({ 
                      message: uploadError instanceof Error ? uploadError.message : 'Image upload failed'
                    });
                  }
            }
            await newUser.save()
            Logger.info(`New user created: ${newUser._id}`)
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
            if(!Authenticator.verifyUser(req,id)) return res.status(401).json({message: "Unauthorized"})
            const data = await UserModel.findByIdAndDelete(id)
            if(!data){
                res.status(404).json({message:"User not found"})
                
            }
            else{
                res.status(200).json({message:"User deleted"})
                Logger.info(`User deleted: ${id}`)

                if(data.imageUrl) ImageController.deleteCloudinaryImage(data.imageUrl)
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
            if(req.user.role == "admin") allowedFields.push("role")

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
                    try {
                        if(user.imageUrl) await ImageController.deleteCloudinaryImage(user.imageUrl)
                        user.imageUrl = await ImageController.uploadToCloudinary(req.body.image);
                      } catch (uploadError) {
                        return res.status(400).json({ 
                          message: uploadError instanceof Error ? uploadError.message : 'Image upload failed'
                        });
                      }
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
            return res.status(200).json(user)
        }
        catch(error:any){
            ErrorHandler.HandleMongooseErrors(error,res)
        }
    }

    static async getBooklist(req:any,res:any){
        try {
            const {id} = req.params
            if(id){
                if(!mongoose.Types.ObjectId.isValid(id)){
                    return res.status(400).json({message: "Invalid id format"})
                }
            }
            else{
                return res.status(400).json({message: "id is required"})
            }
            const potentialBooklist = await UserModel.findById(id).select(["booklist","-_id"])
            if(!potentialBooklist) throw new Error("User not found")
            if(!potentialBooklist.booklist.length) return res.status(200).json([])
            const data = await UserModel.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(id as string) } },
                { $unwind: "$booklist" },
                {
                    $lookup: {
                        from: "books",
                        localField: "booklist.book_id",
                        foreignField: "_id",
                        as: "book"
                    }
                },
                { $unwind: "$book" },
                {
                    $project: {
                        _id: 0,
                        book: "$book",
                        read_status: "$booklist.read_status"
                    }
                },
                {
                    $group: {
                        _id: null,
                        booklist: {
                            $push: {
                                book: "$book",
                                read_status: "$read_status"
                            }
                        }
                    }
                },
                { $project: { _id: 0,"booklist.read_status": 1,  "booklist.book.title": 1, "booklist.book._id": 1, "booklist.book.imageUrl": 1, "booklist.book.author": 1 } }
            ]);

            if(!data || !data[0]) throw new Error("User not found")
            return res.status(200).json(data[0].booklist)
        } catch (error) {
            ErrorHandler.HandleMongooseErrors(error,res)
        }
    }

    static async modifyBooklist(req:any,res:any){
        try {
            const {id} = req.params
            const updates = req.body
            if(id){
                if(!mongoose.Types.ObjectId.isValid(id)){
                    return res.status(400).json({message: "Invalid id format"})
                }
            }
            else{
                return res.status(400).json({message: "id is required"})
            }

            if(!Authenticator.verifyUser(req,id)) throw new Error("Unauthorized")

            const user = await UserModel.findById(id)
            if(!user) throw new Error("User not found")

            for (const key of Object.keys(updates)) {
                if (!mongoose.Types.ObjectId.isValid(key)) {
                    throw new Error("Invalid book id format");
                }
                if(!await BookModel.findById(key)) throw new Error(`Book not found with id: ${key}`)

                const existingIndex = await user.booklist.findIndex((entry:any) => 
                    entry.book_id.toString() === key
                );
                if (existingIndex >= 0) {
                    // Update existing entry
                    if(updates[key]==="delete"){
                        user.booklist.splice(existingIndex,1)
                    }
                    else{
                        user.booklist[existingIndex].read_status = updates[key]
                    }
                } else {
                    if(updates[key]!="delete"){
                        user.booklist.push({ book_id: key, read_status: updates[key] });
                    }
                }

            }
            user._updateContext = "update"
            await user.save()
            return UserController.getBooklist(req,res)
        } catch (error) {
            ErrorHandler.HandleMongooseErrors(error,res)
        }
    }
}
