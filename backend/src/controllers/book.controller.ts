import {Types} from "mongoose"
const BookModel = require("../models/book.model")
import * as dates from "../tools/dates"
import * as validators from "../tools/validators"
import { Projection } from "../models/projection.model"
import { Authenticator } from "./auth.controller"
import { ErrorHandler } from "../tools/errorhandler"
import { Logger } from "../tools/logger"
import { ImageController } from "./image.controller"

export class BookController{
    
    static async getAllBooks(req:any,res:any){
        try{
            let {title, author, minRelease, maxRelease, fields, genre, user_id, page = 0, limit = 10} = req.query

            limit = Number.parseInt(limit)
            page = Number.parseInt(page)
            
            if(Number.isNaN(limit) || Number.isNaN(page) || limit < 1 || page < 0){
                return res.status(400).json({error:"Invalid page or limit"})
            }

            const allowedFields = ["_id","title","author","release","genre","user_id","description","added_at","updated_at"]

            let filters: {title?: RegExp,author?:RegExp,genre?:string, user_id?:string} = {}

            if(title) filters.title = new RegExp(`${title}`,"i")
            if(author) filters.author = new RegExp(`${author}`,"i")
            if(user_id){
                if(!Types.ObjectId.isValid(user_id)){
                    return res.status(400).json({error: "user_id is in invalid format"})
                }
                filters.user_id = user_id
            }
            if(genre){
                const genrePath = BookModel.schema.path("genre")
                const genres: string[] = genrePath.options.enum.map(function(genre: string){return genre.toLowerCase()})
                if(!genres.includes(genre.toLowerCase())){
                    return res.status(400).json({error: "Invalid genre requested"})
                }
                filters.genre = genre
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
                
                
                
                const matchConditions = [];
                
                if (filters) {
                    matchConditions.push({ $match: filters });
                }
                
                if (minRelease || maxRelease) {
                    const releaseFilter: {$gte?:Date,$lte?:Date} = {};
                    
                    if (minRelease) {
                        if(!validators.isValidISODate(minRelease)){
                            return res.status(400).json({error: "Invalid date requested"})
                        }
                        releaseFilter.$gte = new Date(minRelease);
                    }
                    if (maxRelease) {
                        if(!validators.isValidISODate(maxRelease)){
                            return res.status(400).json({error: "Invalid date requested"})
                        }
                        releaseFilter.$lte = new Date(maxRelease);
                    }
                    
                    matchConditions.push({ $match: { release: releaseFilter } });
                }
                
                matchConditions.push({ $project: projection });
                matchConditions.push({ $skip: page * limit });
                matchConditions.push({ $limit: limit });
                
            const books = await BookModel.aggregate(matchConditions);
            if(books){
                Logger.info("Request handled")
                const pages = Math.ceil(await BookModel.estimatedDocumentCount() / limit)
                res.status(200).json({data: books, pages: pages})
            }
        }catch(error:any){
            ErrorHandler.HandleMongooseErrors(error,res)
        }
    }

    static async getBookById(req:any,res:any){
        try{
            const {id, fields} = req.params
            let allowedFields = ["_id","title","author","user_id","genre","release","description","added_at","updated_at"]
            
            const requestedFields: string[] = fields ? fields.split(",") : allowedFields
            const validFields: string[] = requestedFields.filter(field =>allowedFields.includes(field))

            if(validFields.length === 0) return res.status(400).json({error:"Invalid fields requested"})
            
            if(!validFields.includes("_id")) validFields.push("-_id")

            
            const data = await BookModel.findById(id).select(validFields)
            if(data){
                res.status(200).json(data)
            }
            else{
                res.status(404).json({message: "User not found"})
            }
        }catch(error:any){
            res.status(500).json({message:error.message})
        }
    }

    static async createBook(req:any,res:any){
        try{
            let {title, image, author = "Unknown", genre = "None", description = "No description added", release = null} = req.body
            
            if(!title) return res.status(400).json({error: "title required"})
            
            if(!Authenticator.verifyUser(req,"",["editor"])) return res.status(401).json({message:  `Unauthorized`})
            
            if(release){
                if(!validators.isValidISODate(release))
                    return res.status(400).json({error:"Invalid date"})
            }


            const newBook = new BookModel({
                title: title,
                author: author,
                genre: genre,
                description: description,
                release: release,
                user_id: new Types.ObjectId(req.user.id as string)
            })
            if(image){
                try {
                    newBook.imageUrl = await ImageController.uploadToCloudinary(req.body.image);
                  } catch (uploadError) {
                    return res.status(400).json({ 
                      message: uploadError instanceof Error ? uploadError.message : 'Image upload failed'
                    });
                  }
            }
            await newBook.save()
            Logger.info(`New book created: ${newBook._id}`)
            res.status(201).json(newBook)
        }
        catch(error:any){
            ErrorHandler.HandleMongooseErrors(error,res)
        }
    }

    static async deleteBook(req:any,res:any){
        try{
            const {id} = req.params
            if(id){
                if(!Types.ObjectId.isValid(id)){
                    return res.status(400).json({message: "Invalid id format"})
                }
            }
            else{
                return res.status(400).json({message: "id is required"})
            }
            if(!Authenticator.verifyUser(req,"",["editor"])) return res.json(401).send()
            const data = await BookModel.findByIdAndDelete(id)
            if(data){
                res.status(200).json({message:"Book deleted"})
                if(data.imageUrl) ImageController.deleteCloudinaryImage(data.imageUrl)
            }
            else{
                res.status(404).json({message:"Book not found"})
            }
        }
        catch(error:any){
            res.status(500).json({message:error.message})
        }
    }

    static async updateBook(req:any,res:any){
        try{
            const {id} = req.params
            if(id){
                if(!Types.ObjectId.isValid(id)){
                    return res.status(400).json({message: "Invalid id format"})
                }
            }
            else{
                return res.status(400).json({message: "id is required"})
            }
            if(!Authenticator.verifyUser(req,id)) return res.status(401).json({message: "Unauthorized"})
                const book = await BookModel.findById(id)
            const updates = req.body
            const allowedFields = ["title","author","release","genre","description"]
            if(!book) return res.status(404).json({message: "Book not found"})
            for (const key of Object.keys(updates)) {
                if (!allowedFields.includes(key)) {
                    return res.status(400).json({ message: `Cannot update ${key} field` });
                }
                if (key === "release") {
                    if(!validators.isValidISODate(updates[key])){
                        return res.status(400).json({message: "Invalid date"})
                    }
                } 
                if (key === "genre") {
                    const genrePath = BookModel.schema.path("genre")
                    const genres: string[] = genrePath.options.enum.map(function(genre: string){return genre.toLowerCase()})
                    if(!genres.includes(updates[key].toLowerCase())){
                        return res.status(400).json({error: "Invalid genre requested"})
                    }
                }
                if(key === "image"){
                    try {
                        book.imageUrl = await ImageController.uploadToCloudinary(req.body.image);
                      } catch (uploadError) {
                        return res.status(400).json({ 
                          message: uploadError instanceof Error ? uploadError.message : 'Image upload failed'
                        });
                      }
                }
                else{
                    book[key] = updates[key];
                }
            }
            await book.save()
            Logger.info(`Book saved: ${book._id}`)
            return res.status(200).json({book})
        }
        catch(error:any){
            ErrorHandler.HandleMongooseErrors(error,res)
        }
    }
}