const ReviewModel = require("../models/review.model")
const CommentModel = require("../models/comment.model")
const mongoose = require("mongoose")
import { Projection } from "../models/projection.model"
import * as dates from "../tools/dates"
import * as validators from "../tools/validators"
import { Authenticator } from "./auth.controller"
import { ErrorHandler } from "../tools/errorhandler"
import { Logger } from "../tools/logger"
import { Types } from "mongoose"

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
            const allowedFields = ["_id","like_score","score","content","created_at","updated_at","book.title","book._id","book.author","book.imageUrl","user._id", "user.username","user.imageUrl","user.role","user.updated_at","user.created_at","user.last_login"]

            if(!minCreate) minCreate = dates.minDate()
            if(!maxCreate) maxCreate = dates.maxDate()
            if(!minUpdate) minUpdate = dates.minDate()
            if(!maxUpdate) maxUpdate = dates.maxDate()
    
            if(!validators.isValidISODate(minCreate)|| !validators.isValidISODate(maxCreate) || !validators.isValidISODate(minUpdate || !validators.isValidISODate(maxUpdate))){
                return res.status(400).json({error:"Invalid date requested"})
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
            }, {"_id": 0,"liked_by":1,"disliked_by":1} as Projection)


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

            if(data.length){
                const pages = Math.ceil(await ReviewModel.estimatedDocumentCount() / limit)
                await Authenticator.verifyUser(req)
                data.forEach((review: any) => {review.liked_by_user = "none"})
                if(req.user){
                    const userId = new Types.ObjectId(req.user.id as string)
                    data.forEach((review: any) => {
                        if (review.liked_by && review.liked_by.some((id: Types.ObjectId) => id.equals(userId))){
                            review.liked_by_user = "liked"
                        }
                        else if (review.disliked_by && review.disliked_by.some((id: Types.ObjectId) => id.equals(userId))){
                            review.liked_by_user = "disliked"
                        }
                        delete review.liked_by
                        delete review.disliked_by
                    });
                }
                Logger.info("Request handled")
                return res.status(200).json({data: data, pages: pages})
            }
            else{
                Logger.warn("No reviews found")
                return res.status(404).json({message: "No reviews found"})
            }
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

            let allowedFields = ["_id","like_score","score","content","created_at","updated_at","book.title","book.author","book._id","user._id","user.username","user.imageUrl","user.role","user.updated_at","user.created_at","user.last_login"]
            
            const requestedFields: string[] = fields ? fields.split(",") : allowedFields
            const validFields: string[] = requestedFields.filter(field =>allowedFields.includes(field))

            if(validFields.length === 0) return res.status(400).json({error:"Invalid fields requested"})
            
            if(!validFields.includes("_id")) validFields.push("-_id")

            const projection: Projection = validFields.reduce((acc: Projection,field)=>{
                acc[field] = 1
                return acc
            }, {"_id": 0,"liked_by":1,"disliked_by":1} as Projection)

    

            const data = await ReviewModel.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(id as string) } },
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

              let review = data[0]
              if(review){
                  review.liked_by_user = "none"
                  await Authenticator.verifyUser(req)
                  if(req.user){
                      const userId = new Types.ObjectId(req.user.id as string)
                      if (review.liked_by && review.liked_by.some((id: Types.ObjectId) => id.equals(userId))){
                          review.liked_by_user = "liked"
                      }
                      else if (review.disliked_by && review.disliked_by.some((id: Types.ObjectId) => id.equals(userId))){
                          review.liked_by_user = "disliked"
                      }
                  }
                  res.status(200).json(review)
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
            const {book_id,score,content = null} = req.body
            
            if(book_id){
                if(!mongoose.Types.ObjectId.isValid(book_id)){
                    return res.status(400).json({message: "Invalid id format on book_id"})
                }
            }
            else{
                return res.status(400).json({message: "book_id is required"})
            }
            if(!score)
                return res.status(400).json({message: "score required"}) 
            if(Number.isNaN(score)){
                return res.status(400).json({message: "Invalid score, must be a number"})
            }
            if(!Authenticator.verifyUser(req)) return res.json(401).send()
            
            const existingReview = await ReviewModel.findOne({user_id: new mongoose.Types.ObjectId(req.user.id as string), book_id: new mongoose.Types.ObjectId(book_id as string)})
            if(existingReview){
                throw new Error("User already posted a review on book")
            }
            const newReview = new ReviewModel({
                user_id: new mongoose.Types.ObjectId(req.user.id as string),
                book_id: new mongoose.Types.ObjectId(book_id as string),
                score: score,
                content: content
            })
            await newReview.save()
            res.status(201).json(newReview)
        } catch (error:any) {
            ErrorHandler.HandleMongooseErrors(error,res)
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
            
            if(!Authenticator.verifyUser(req,review.user_id)) return res.json(401).send()
            
            const data = await ReviewModel.findByIdAndDelete(id)
            if(data){
                res.status(200).json({message:"Review deleted"})
                const deletedComments = await CommentModel.deleteMany({review_id: id})
                if(deletedComments.deletedCount) Logger.info(`Deleted ${deletedComments.deletedCount} comments of user: ${id}`)
            }
            else{
                res.status(404).json({message:"Review not found"})
            }
        } catch (error:any) {
            ErrorHandler.HandleMongooseErrors(error,res)
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
            
            if(!Authenticator.verifyUser(req,review.user_id)) return res.json(401).send()
            
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
            return res.status(200).json(review)
        }
        catch(error:any){
            ErrorHandler.HandleMongooseErrors(error,res)
        }
    }

    static async getLikedBy(req:any,res:any){
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
            const potentialLikedBy = await ReviewModel.findById(id).select(["liked_by","-_id"])
            if(!potentialLikedBy.liked_by.length) return res.status(200).json([])
            const data = await ReviewModel.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(id as string) } },
                {$lookup:{
                    from: "users",
                    localField: "liked_by",
                    foreignField: "_id",
                    as: "liked_by"
                }},
                {$project: {"liked_by._id": 1, "liked_by.username": 1, "liked_by.imageUrl": 1}}
            ]);

            if(!data) throw new Error("Review not found")
            return res.status(200).json(data[0].liked_by)
        } catch (error) {
            ErrorHandler.HandleMongooseErrors(error,res)
        }
    }

    static async getDislikedBy(req:any,res:any){
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
            const potentialDislikedBy = await ReviewModel.findById(id).select(["disliked_by","-_id"])
            if(!potentialDislikedBy.disliked_by.length) return res.status(200).json([])
            const data = await ReviewModel.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(id as string) } },
                {$lookup:{
                    from: "users",
                    localField: "disliked_by",
                    foreignField: "_id",
                    as: "disliked_by"
                }},
                {$project: {"disliked_by._id": 1, "disliked_by.username": 1, "disliked_by.imageUrl": 1}}
            ]);

            if(!data) throw new Error("Review not found")
            return res.status(200).json(data[0].disliked_by)
        } catch (error) {
            ErrorHandler.HandleMongooseErrors(error,res)
        }
    }

    static async putLike(req:any,res:any){
        try {
            const {id} = req.params
            const {action} = req.body
            if(id){
                if(!mongoose.Types.ObjectId.isValid(id)){
                    return res.status(400).json({message: "Invalid id format"})
                }
            }
            else{
                return res.status(400).json({message: "id is required"})
            }
            if(!Authenticator.verifyUser(req)) throw new Error("Unauthorized")

            const review = await ReviewModel.findById(id)
            if(!review) throw new Error("Review not found")
            const likeIndex = await review.liked_by.findIndex((entry:any) => 
                    entry.toString() === req.user.id
            );
            const dislikeIndex = await review.disliked_by.findIndex((entry:any) => 
                entry.toString() === req.user.id
            );
            switch (action) {
                case "like":
                    if(dislikeIndex>=0){
                        review.disliked_by.splice(dislikeIndex,1)
                    }
                    if(likeIndex<0){
                        review.liked_by.push(new Types.ObjectId(req.user.id as string))
                    }
                    break;
                case "dislike":
                    if(likeIndex>=0){
                        review.liked_by.splice(likeIndex,1)
                    }
                    if(dislikeIndex<0){
                        review.disliked_by.push(new Types.ObjectId(req.user.id as string))
                    }
                    break;
                case "delete":
                    if(likeIndex>=0){
                        review.liked_by.splice(likeIndex,1)
                    }
                    if(dislikeIndex>=0){
                        review.disliked_by.splice(dislikeIndex,1)
                    }
                    break;
                default:
                    throw new Error("Wrong action used")
                    break;
            }
            await review.save()
            return res.status(200).json()
            
        } catch (error) {
            ErrorHandler.HandleMongooseErrors(error,res)
        }
    }
}