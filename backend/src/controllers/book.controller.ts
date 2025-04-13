import {Types} from "mongoose"
const BookModel = require("../models/book.model")
const ReviewModel = require("../models/review.model")
const UserModel = require("../models/user.model")
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
            let {title, author, minRelease, maxRelease, fields, genre, user_id, page = 0, limit = 10, sort, sortType = "desc"} = req.query

            limit = Number.parseInt(limit)
            page = Number.parseInt(page)
            
            if(Number.isNaN(limit) || Number.isNaN(page) || limit < 1 || page < 0){
                return res.status(400).json({message:"Invalid page or limit"})
            }

            const allowedFields = ["_id","title","author","release","genre","user._id", "user.username", "user.created_at","user.updated_at","user.last_login","user.role","user.imageUrl","description","added_at","updated_at","imageUrl"]

            let filters: {title?: RegExp,author?:RegExp,genre?:string, user_id?:string} = {}

            if(title) filters.title = new RegExp(`${title}`,"i")
            if(author) filters.author = new RegExp(`${author}`,"i")
            if(user_id){
                if(!Types.ObjectId.isValid(user_id)){
                    return res.status(400).json({message: "user_id is in invalid format"})
                }
                filters.user_id = user_id
            }
            if(genre){
                const genrePath = BookModel.schema.path("genre")
                const genres: string[] = genrePath.options.enum.map(function(genre: string){return genre.toLowerCase()})
                if(!genres.includes(genre.toLowerCase())){
                    return res.status(400).json({message: "Invalid genre requested"})
                }
                filters.genre = genre
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
                
                
                
                const matchConditions = [];
                
                if (filters) {
                    matchConditions.push({ $match: filters });
                }
                
                if (minRelease || maxRelease) {
                    const releaseFilter: {$gte?:Date,$lte?:Date} = {};
                    
                    if (minRelease) {
                        if(!validators.isValidISODate(minRelease)){
                            return res.status(400).json({message: "Invalid date requested"})
                        }
                        releaseFilter.$gte = new Date(minRelease);
                    }
                    if (maxRelease) {
                        if(!validators.isValidISODate(maxRelease)){
                            return res.status(400).json({message: "Invalid date requested"})
                        }
                        releaseFilter.$lte = new Date(maxRelease);
                    }
                    
                    matchConditions.push({ $match: { release: releaseFilter } });
                }
                

                if(sort){
                    switch (sortType) {
                        case "desc":
                            sortType = -1
                            break;
                        case "asc":
                            sortType = 1
                            break;
                        default:
                            throw new Error("Invalid sort type, desc / asc allowed")
                    }
                    switch (sort) {
                        case "title":
                            matchConditions.push({ $sort: {title: sortType} });
                            break;
                        case "added_at":
                            matchConditions.push({ $sort: {added_at: sortType} });
                            break;
                        case "genre":
                            matchConditions.push({ $sort: {genre: sortType} });
                            break;
                        case "release":
                            matchConditions.push({ $sort: {release: sortType} });
                            break;
                        default:
                            throw new Error("Invalid sort, title/added_at/genre/release allowed")
                    }
                }
                matchConditions.push({$lookup:{
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user"
                }})
                matchConditions.push({$unwind:{
                    path: "$user",
                    preserveNullAndEmptyArrays: true
                }})
                matchConditions.push({$facet:{
                    data: [
                        {$skip: page*limit},
                        {$limit: limit},
                        {$project: projection}
                    ],
                    count:[{$count:"count"}]
                }})
                matchConditions.push({$project:{data: 1, count: {$arrayElemAt: ["$count",0]}}});
                
            const data = await BookModel.aggregate(matchConditions);
            console.log(data)
            let books = data[0]
            if(books && books.data && books.data.length){
                const pages = Math.ceil(Number.parseInt(books.count.count) / limit)

                Logger.info("Request handled")
                res.status(200).json({data: books.data, pages: pages})
            }
            else{
                res.status(404).json({message: "No books found"})
            }
        }catch(error:any){
            ErrorHandler.HandleMongooseErrors(error,res)
        }
    }

    static async getBookById(req:any,res:any){
        try{
            const {id} = req.params
            const {fields} = req.query
            let allowedFields = ["_id","title","author","user_id","genre","release","description","added_at","updated_at","imageUrl"]
            
            const requestedFields: string[] = fields ? fields.split(",") : allowedFields
            const validFields: string[] = requestedFields.filter(field =>allowedFields.includes(field))

            if(validFields.length === 0) return res.status(400).json({message:"Invalid fields requested"})
            
            if(!validFields.includes("_id")) validFields.push("-_id")

            
            const data = await BookModel.findById(id).select(validFields)
            if(data){
                res.status(200).json(data)
            }
            else{
                res.status(404).json({message: "Book not found"})
            }
        }catch(error:any){
            res.status(500).json({message:error.message})
        }
    }

    static async createBook(req:any,res:any){
        try{
            let {title, image, author = "Unknown", genre = "None", description = "No description added", release = null} = req.body
            
            if(!title) return res.status(400).json({message: "title is required"})
            
            if(!Authenticator.verifyUser(req,"",["editor"])) return res.status(401).json({message:  `Unauthorized`})
            
            if(release){
                if(!validators.isValidISODate(release))
                    return res.status(400).json({message:"Invalid date"})
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
            if(!Authenticator.verifyUser(req,"",["editor"])) throw new Error("Unauthorized")
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
            ErrorHandler.HandleMongooseErrors(error,res)
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
            const book = await BookModel.findById(id)
            if(!book) return res.status(404).json({message: "Book not found"})
            if(!Authenticator.verifyUser(req,book.user_id)) return res.status(401).json({message: "Unauthorized"})
            const updates = req.body
            const allowedFields = ["title","author","release","genre","description","image"]
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
                        if(book.imageUrl) await ImageController.deleteCloudinaryImage(book.imageUrl)
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
            return res.status(200).json(book)
        }
        catch(error:any){
            ErrorHandler.HandleMongooseErrors(error,res)
        }
    }
}