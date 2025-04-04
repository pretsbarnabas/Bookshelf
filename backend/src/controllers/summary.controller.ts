import * as dates from "../tools/dates"
import * as validators from "../tools/validators"
import { Logger } from "../tools/logger"
import { Projection } from "../models/projection.model"
import { ErrorHandler } from "../tools/errorhandler"
import { Authenticator } from "./auth.controller"
const SummaryModel = require("../models/summary.model")
const mongoose = require("mongoose")


export class SummaryController{
    
    private static allowedFields = ["_id","content","added_at","updated_at","book.title","book._id","book.author","book.imageUrl","user._id", "user.username","user.imageUrl","user.role"]

    static async getAllSummaries(req:any,res:any){
        try{
            let {book_id, user_id, minCreate, maxCreate, minUpdate, maxUpdate,fields, limit = 10, page = 0} = req.query

            let filters: {book_id?: string, user_id?: string} = {}

            limit = Number.parseInt(limit)
            page = Number.parseInt(page)
            if(Number.isNaN(limit) || Number.isNaN(page) || limit < 1 || page < 0){
                return res.status(400).json({error:"Invalid page or limit"})
            }

            if(!minCreate) minCreate = dates.minDate()
            if(!maxCreate) maxCreate = dates.maxDate()
            if(!minUpdate) minUpdate = dates.minDate()
            if(!maxUpdate) maxUpdate = dates.maxDate()
    
            if(!validators.isValidISODate(minCreate)|| !validators.isValidISODate(maxCreate) || !validators.isValidISODate(minUpdate || !validators.isValidISODate(maxUpdate))){
                return res.status(400).json({error:"Invalid date requested"})
            }

            const requestedFields: string[] = fields ? fields.split(",") : SummaryController.allowedFields
            const validFields: string[] = requestedFields.filter(field =>SummaryController.allowedFields.includes(field))

            if(validFields.length === 0){
                Logger.info("Invalid fields requested")
                return res.status(400).json({error:"Invalid fields requested"})
            }

            if(!validFields.includes("_id")) validFields.push("-_id")

            const projection: Projection = validFields.reduce((acc: Projection,field)=>{
                acc[field] = 1
                return acc
            }, {"_id": 0} as Projection)

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

            const data = await SummaryModel.aggregate([
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
                Logger.info("Request handled")
                const pages = Math.ceil(await SummaryModel.estimatedDocumentCount() / limit)
                res.status(200).json({data: data, pages: pages})
            }
            else{
                Logger.warn("No summaries found")
                res.status(404).json({message: "No summaries found"})
            }

        }catch(error:any){
            ErrorHandler.HandleMongooseErrors(error,res)
        }
    }

    static async getSummaryById(req:any,res:any){
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

            const requestedFields: string[] = fields ? fields.split(",") : SummaryController.allowedFields
            const validFields: string[] = requestedFields.filter(field =>SummaryController.allowedFields.includes(field))

            if(validFields.length === 0) return res.status(400).json({error:"Invalid fields requested"})
            
            if(!validFields.includes("_id")) validFields.push("-_id")

            const projection: Projection = validFields.reduce((acc: Projection,field)=>{
                acc[field] = 1
                return acc
            }, {"_id": 0} as Projection)

            const data = await SummaryModel.aggregate([
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

            if(data.length){
                res.status(200).json(data[0])
            }
            else{
                res.status(404).json({message: "Summary not found"})
            }
        }catch(error:any){
            ErrorHandler.HandleMongooseErrors(error,res)
        }
    }

    static async createSummary(req:any,res:any){
        try{
            const {book_id, content} = req.body

            if(book_id){
                if(!mongoose.Types.ObjectId.isValid(book_id)){
                    return res.status(400).json({message: "Invalid id format on book_id"})
                }
            }
            else{
                return res.status(400).json({message: "book_id is required"})
            }
            if(!content){
                Logger.warn("Content is required")
                return res.status(400).json({message: "content is required"})
            }

            if(!Authenticator.verifyUser(req,"",["editor"])) return res.json(401).send()

            const newSummary = new SummaryModel({
                user_id: new mongoose.Types.ObjectId(req.user.id),
                book_id: new mongoose.Types.ObjectId(book_id as string),
                content: content
            })
            await newSummary.save()
            res.status(201).json(newSummary)

        }
        catch(error:any){
            res.status(500).json({message:error.message})
        }
    }

    static async deleteSummary(req:any,res:any){
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
            const summary = await SummaryModel.findById(id)
            if(!summary) return res.status(404).json({message: "Review not found"})
            
            if(!Authenticator.verifyUser(req,summary.user_id)) return res.json(401).send()
            
            const data = await SummaryModel.findByIdAndDelete(id)
            if(data){
                res.status(200).json({message:"Review deleted"})
            }
            else{
                res.status(404).json({message:"Review not found"})
            }
        } catch (error:any) {
            ErrorHandler.HandleMongooseErrors(error,res)
        }
    }

    static async updateSummary(req:any,res:any){
        try{
            const {id} = req.params
            const {content} = req.body
            if(id){
                if(!mongoose.Types.ObjectId.isValid(id)){
                    return res.status(400).json({message: "Invalid id format"})
                }
            }
            else{
                return res.status(400).json({message: "id is required"})
            }
            if(!content){
                Logger.warn("Content is required")
                return res.status(400).json({message: "content is required"})
            }
            const summary = await SummaryModel.findById(id)
            if(!summary) return res.status(404).json({message: "Review not found"})
            
            if(!Authenticator.verifyUser(req,summary.user_id)) return res.json(401).send()
            
            summary.content = content

            await summary.save()
            return res.status(200).json(summary)
        }
        catch(error:any){
            ErrorHandler.HandleMongooseErrors(error,res)
        }
    }
}