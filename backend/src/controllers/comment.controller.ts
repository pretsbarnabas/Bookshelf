import mongoose, {Types} from "mongoose"
import { ErrorHandler } from "../tools/errorhandler"
import { Logger } from "../tools/logger"
import * as dates from "../tools/dates"
import * as validators from "../tools/validators"
import { Projection } from "../models/projection.model"
import { Authenticator } from "./auth.controller"
const CommentModel = require("../models/comment.model")

export class CommentController{
    
    static async getAllComments(req:any,res:any){
        try{
            let {review_id,user_id,minCreate,maxCreate,minUpdate,maxUpdate, fields, page = 0, limit = 10} = req.query
            
            
            limit = Number.parseInt(limit)
            page = Number.parseInt(page)
            
            if(Number.isNaN(limit) || Number.isNaN(page) || limit < 1 || page < 0){
                Logger.warn("Invalid page or limit requested")
                return res.status(400).json({error:"Invalid page or limit"})
            }

            
            let filters: {review_id?: string, user_id?: string} = {}
            
            if(review_id){
                if(!Types.ObjectId.isValid(review_id)){
                    Logger.warn("review_id is in invalid format")
                    return res.status(400).json({error: "review_id is in invalid format"})
                }
                filters.user_id = user_id
            }
            if(user_id){
                if(!Types.ObjectId.isValid(user_id)){
                    Logger.warn("user_id is in invalid format")
                    return res.status(400).json({error: "user_id is in invalid format"})
                }
                filters.user_id = user_id
            }
            
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

            const allowedFields = ["_id","review._id","review.content","review.score","review.user._id","review.user.username","review.user.role","review.user.imageUrl","user._id","user.username","user.role","user.imageUrl","content","created_at","updated_at"]

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

            const comments = await CommentModel.aggregate([
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
                    from: "reviews",
                    localField: "review_id",
                    foreignField: "_id",
                    as: "review"
                }},
                {$unwind:{
                    path: "$review",
                    preserveNullAndEmptyArrays: true
                }},
                {$lookup:{
                    from: "users",
                    localField: "review.user_id",
                    foreignField: "_id",
                    as: "review.user"
                }},
                {$unwind:{
                    path: "$review.user",
                    preserveNullAndEmptyArrays: true
                }},
                {$project: projection},
                {$skip: page*limit},
                {$limit: limit}
            ])
            if(comments.length){
                const pages = Math.ceil(await CommentModel.estimatedDocumentCount() / limit)
                Logger.info("Request handled")
                return res.status(200).json({data: comments, pages: pages})
            }
            else{
                Logger.warn("No comments found")
                return res.status(404).json({message: "No comments found"})
            }


        }catch(error:any){
            ErrorHandler.HandleMongooseErrors(error,res)
        }
    }

    static async getCommentById(req:any,res:any){
        try{
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

            const allowedFields = ["_id","review._id","review.content","review.score","review.user._id","review.user.username","review.user.role","review.user.imageUrl","user._id","user.username","user.role","user.imageUrl","content","created_at","updated_at"]

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
    
        

            const data = await CommentModel.aggregate([
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
                    from: "reviews",
                    localField: "review_id",
                    foreignField: "_id",
                    as: "review"
                }},
                {$unwind:{
                    path: "$review",
                    preserveNullAndEmptyArrays: true
                }},
                {$lookup:{
                    from: "users",
                    localField: "review.user_id",
                    foreignField: "_id",
                    as: "review.user"
                }},
                {$unwind:{
                    path: "$review.user",
                    preserveNullAndEmptyArrays: true
                }},
                { $project: projection }
              ])
            res.status(200).json(data)
        }catch(error:any){
            ErrorHandler.HandleMongooseErrors(error,res)
        }
    }

    static async createComment(req:any,res:any){
        try{
            const {review_id, content} = req.body
            if(!Authenticator.verifyUser(req)) return res.json(401).send()
            if(review_id){
                if(!mongoose.Types.ObjectId.isValid(review_id)){
                    Logger.warn("Invalid review_id format")
                    return res.status(400).json({message: "Invalid id format on review_id"})
                }
            }
            else{
                Logger.warn("review_id is required")
                return res.status(400).json({message: "review_id is required"})
            }
            if(!content){
                Logger.warn("content is required")
                return res.status(400).json({mesasage: "content is required"})
            }

            const newComment = new CommentModel({
                review_id: new mongoose.Types.ObjectId(review_id as string),
                user_id: new mongoose.Types.ObjectId(req.user.id as string),
                content: content
            })

            await newComment.save()
            Logger.info(`New comment created: ${newComment._id}`)
            res.status(201).json(newComment)
        }
        catch(error:any){
            ErrorHandler.HandleMongooseErrors(error,res)
        }
    }

    static async deleteComment(req:any,res:any){
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
            const data = await CommentModel.findByIdAndDelete(id)
            if(!data){
                res.status(404).json({message:"Comment not found"})
                
            }
            else{
                res.status(200).json({message:"Comment deleted"})
                Logger.info(`Comment deleted: ${id}`)
            }
            
        }
        catch(error:any){
            ErrorHandler.HandleMongooseErrors(error,res)
        }
    }

    static async updateComment(req:any,res:any){
        try{
            const {id} = req.params
            const {content} = req.body
            if(!content){
                Logger.warn("content is required")
                return res.status(400).json({message: "content is required"})
            }
            if(!Authenticator.verifyUser(req,id)) return res.status(401).json({message: "Unauthorized"})
            
            const comment = await CommentModel.findById(id)
            if(!comment) return res.status(404).json({message: "User not found"})

            comment.content = content
            await comment.save()
            return res.status(200).json({comment})
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
            const potentialLikedBy = await CommentModel.findById(id).select(["liked_by","-_id"])
            if(!potentialLikedBy.liked_by.length) return res.status(200).json([])
            const data = await CommentModel.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(id as string) } },
                {$lookup:{
                    from: "users",
                    localField: "liked_by",
                    foreignField: "_id",
                    as: "liked_by"
                }},
                {$project: {"liked_by._id": 1, "liked_by.username": 1, "liked_by.imageUrl": 1}}
            ]);

            if(!data) throw new Error("Comment not found")
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
            const potentialDislikedBy = await CommentModel.findById(id).select(["disliked_by","-_id"])
            if(!potentialDislikedBy.disliked_by.length) return res.status(200).json([])
            const data = await CommentModel.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(id as string) } },
                {$lookup:{
                    from: "users",
                    localField: "disliked_by",
                    foreignField: "_id",
                    as: "disliked_by"
                }},
                {$project: {"disliked_by._id": 1, "disliked_by.username": 1, "disliked_by.imageUrl": 1}}
            ]);

            if(!data) throw new Error("Comment not found")
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
            if(!Authenticator.verifyUser(req,id)) throw new Error("Unauthorized")

            const comment = await CommentModel.findById(id)
            if(!comment) throw new Error("Review not found")
            const likeIndex = await comment.liked_by.findIndex((entry:any) => 
                    entry.toString() === req.user.id
            );
            const dislikeIndex = await comment.disliked_by.findIndex((entry:any) => 
                entry.toString() === req.user.id
            );
            switch (action) {
                case "like":
                    if(dislikeIndex>=0){
                        comment.disliked_by.splice(dislikeIndex,1)
                    }
                    if(likeIndex<0){
                        comment.liked_by.push(new Types.ObjectId(req.user.id as string))
                    }
                    break;
                case "dislike":
                    if(likeIndex>=0){
                        comment.liked_by.splice(likeIndex,1)
                    }
                    if(dislikeIndex<0){
                        comment.disliked_by.push(new Types.ObjectId(req.user.id as string))
                    }
                    break;
                case "delete":
                    if(likeIndex>=0){
                        comment.liked_by.splice(likeIndex,1)
                    }
                    if(dislikeIndex>=0){
                        comment.disliked_by.splice(dislikeIndex,1)
                    }
                    break;
                default:
                    throw new Error("Wrong action used")
                    break;
            }
            await comment.save()
            return res.status(200).json()
            
        } catch (error) {
            ErrorHandler.HandleMongooseErrors(error,res)
        }
    }
}