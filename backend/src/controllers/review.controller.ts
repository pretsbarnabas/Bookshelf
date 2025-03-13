const ReviewModel = require("../models/review.model")
const mongoose = require("mongoose")
import { Projection } from "../models/projection.model"
import * as tools from "../tools/tools"
import { UserController } from "./user.controller"

export class ReviewController{

    static async getAllReviews(req:any,res:any){
        try{
            let {user_id, book_id, score, minCreate, maxCreate, minUpdate, maxUpdate, page=0, limit=10, fields} = req.query

            let filters: {user_id?:string, book_id?:string, score?:number} = {}

            limit = Number.parseInt(limit)
            page = Number.parseInt(page)
            if(score){
                score = Number.parseInt(score)
                if(Number.isNaN(score)|| score<1 || score>10){
                    return res.status(400).json({error: "Invalid score"})
                }
                filters.score = score
            }
            
            if(Number.isNaN(limit) || Number.isNaN(page) || limit < 1 || page < 0){
                return res.status(400).json({error:"Invalid page or limit"})
            }
            const allowedFields = ["_id","score","content","created_at","updated_at","book.title", "user.username"]

            if(!minCreate) minCreate = tools.minDate()
            if(!maxCreate) maxCreate = tools.maxDate()
            if(!minUpdate) minUpdate = tools.minDate()
            if(!maxUpdate) maxUpdate = tools.maxDate()
    
            if(!tools.isValidISODate(minCreate)|| !tools.isValidISODate(maxCreate) || !tools.isValidISODate(minUpdate || !tools.isValidISODate(maxUpdate))){
                return res.status(400).json({error:"Invalid date requested"})
            }

            const requestedFields: string[] = fields ? fields.split(",") : allowedFields
            const validFields: string[] = requestedFields.filter(field =>allowedFields.includes(field))

            if(!validFields.includes("_id")) validFields.push("-_id")

            const projection: Projection = validFields.reduce((acc: Projection,field)=>{
                acc[field] = 1
                return acc
            }, {"_id": 0} as Projection)

            if(validFields.length === 0) return res.status(400).json({error:"Invalid fields requested"})

            if(user_id){
                if(mongoose.Types.ObjectId.isValid(user_id)){
                    filters.user_id = new mongoose.Types.ObjectId(user_id)
                }
                else{
                    return res.status(400).json({message: "Invalid user_id format"})
                }
            }
            if(book_id){
                if(mongoose.Types.ObjectId.isValid(book_id)){
                    filters.book_id = new mongoose.Types.ObjectId(book_id)
                }
                else{
                    return res.status(400).json({message: "Invalid book_id format"})
                }
            }

            const data = await ReviewModel.aggregate([
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
                {$lookup:{
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user"
                }},
                {$unwind:{
                    path: "$user",
                    preserveNullAndEmptyArrays: true
                }},
                {$lookup:{
                    from: "books",
                    localField: "book_id",
                    foreignField: "_id",
                    as: "book"
                }},
                {$unwind:{
                    path: "$book",
                    preserveNullAndEmptyArrays: true
                }},
                {$project: projection},
                {$skip: page*limit},
                {$limit: limit}
            ])

            if(data) res.status(200).json(data)
        }catch(error:any){
            res.status(500).json({message:error.message})
        }
    }

    static async getUsersReviews(req:any,res:any){
        req.query.user_id = req.params.id
        ReviewController.getAllReviews(req,res)
    }

    static async getReviewById(req:any,res:any){
        try {
            const {id} = req.params
            const {fields} = req.query

            if(id){
                if(!mongoose.Types.ObjectId.isValid(id)){
                    return res.status(400).json({message: "Invalid id format"})
                }
            }
            else{
                return res.status(400).json({message: "id is required"})
            }

            let allowedFields = ["_id","score","content","created_at","updated_at","book.title","book.author","user.username"]
            
            const requestedFields: string[] = fields ? fields.split(",") : allowedFields
            const validFields: string[] = requestedFields.filter(field =>allowedFields.includes(field))

            if(validFields.length === 0) return res.status(400).json({error:"Invalid fields requested"})
            
            if(!validFields.includes("_id")) validFields.push("-_id")

            const projection: Projection = validFields.reduce((acc: Projection,field)=>{
                acc[field] = 1
                return acc
            }, {"_id": 0} as Projection)

            if(validFields.length === 0) return res.status(400).json({error:"Invalid fields requested"})
    

            const data = await ReviewModel.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(id) } },
                {$lookup:{
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user"
                }},
                {$unwind:{
                    path: "$user",
                    preserveNullAndEmptyArrays: true
                }},
                {$lookup:{
                    from: "books",
                    localField: "book_id",
                    foreignField: "_id",
                    as: "book"
                }},
                {$unwind:{
                    path: "$book",
                    preserveNullAndEmptyArrays: true
                }},
                { $project: projection }
              ])

            if(data[0]){
                res.status(200).json(data)
            }
            else{
                res.status(404).json({message: "Review not found"})
            }
        } catch (error:any) {
            res.status(500).json({message:error.message})
        }

    }

    static async createReview(req:any,res:any){
        try {
            const {user_id,book_id,score,content = ""} = req.body
            
            if(!user_id || !book_id || !score)
                return res.status(400).json({message: "user_id, book_id, score required"}) 
            
            const newReview = new ReviewModel({
                user_id: user_id,
                book_id: book_id,
                score: score,
                content: content
            })
            await newReview.save()
            res.status(201).json(newReview)
        } catch (error:any) {
            UserController.HandleMongooseErrors(error,res)
        }
    }

    static async deleteReview(req:any,res:any){
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
            const review = await ReviewModel.findById(id)
            if(!review) return res.status(404).json({message: "Review not found"})
            
            if(!UserController.verifyUser(req,review.user_id)) return res.json(401).send()
            
            const data = await ReviewModel.findByIdAndDelete(id)
            if(data){
                res.status(200).json({message:"Review deleted"})
            }
            else{
                res.status(404).json({message:"Review not found"})
            }
        } catch (error:any) {
            res.status(500).json({message:error.message})
        }
        
    }

    static async updateReview(req:any,res:any){
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
            const review = await ReviewModel.findById(id)
            if(!review) return res.status(404).json({message: "Review not found"})
            
            if(!UserController.verifyUser(req,review.user_id)) return res.json(401).send()
            
            const updates = req.body
            const allowedFields = ["score","content"]

            for (const key of Object.keys(updates)) {
                if (!allowedFields.includes(key)) {
                    return res.status(400).json({ message: `Cannot update ${key} field` });
                }
                if (key === "score") {
                    updates[key] = Number.parseInt(updates[key])
                    if(Number.isNaN(updates[key]))
                        return res.status(400).json({message: "score must be a number between 1-10"})
                } 
                review[key] = updates[key];
            }
            await review.save()
            return res.status(200).json({review:review})
        }
        catch(error:any){
            UserController.HandleMongooseErrors(error,res)
        }
    }
}