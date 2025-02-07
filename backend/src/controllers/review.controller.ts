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

            const allowedFields = ["_id","user_id","book_id","score","content","created_at","updated_at","user","book.title"]

            if(!minCreate) minCreate = new Date(0).toISOString().slice(0,-5)
            if(!maxCreate) maxCreate = new Date(Date.now() + 2 * (60*60*1000)).toISOString().slice(0,-5)
            if(!minUpdate) minUpdate = new Date(0).toISOString().slice(0,-5)
            if(!maxUpdate) maxUpdate = new Date(Date.now() + 2 * (60*60*1000)).toISOString().slice(0,-5)
    
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
                    filters.user_id = new mongoose.Types.ObjectId(book_id)
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
        const {id} = req.params
        try{
            const review = await ReviewModel.findById(id)
            res.status(200).json(review)
        }catch(error:any){
            res.status(500).json({message:error.message})
        }
    }

    static async createReview(req:any,res:any){
        const review = req.body
        const newReview = new ReviewModel({
            user_id: review.user_id,
            book_id: review.book_id,
            rating: review.rating,
            review: review.review
        })
        try{
            await newReview.save()
            res.status(201).json(newReview)
        }
        catch(error:any){
            res.status(500).json({message:error.message})
        }
    }

    static async deleteReview(req:any,res:any){
        try{
            const id = req.params
            const data = await ReviewModel.findByIdAndDelete(id)
            if(data){
                res.status(200).json({message:"Review deleted"})
            }
            else{
                res.status(404).json({message:"Review not found"})
            }
        }
        catch(error:any){
            res.status(500).json({message:error.message})
        }
    }

    static async updateReview(req:any,res:any){
        try{
            const id = req.params
            const review = req.body
            const updatedReview = await ReviewModel.findByIdAndUpdate(id,review,{new:true})
            if(updatedReview){
                res.status(200).json(updatedReview)
            }
            else{
                res.status(404).json({message:"Review not found"})
            }
        }
        catch(error:any){
            res.status(500).json({message:error.message})
        }
    }
}