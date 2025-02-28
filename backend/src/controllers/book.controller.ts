import {Types} from "mongoose"
const BookModel = require("../models/book.model")
import * as tools from "../tools/tools"
import { Projection } from "../models/projection.model"
import { UserController } from "./user.controller"

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
            
            if(!minRelease) minRelease = tools.minDate() 
            if(!maxRelease) maxRelease = tools.maxDate()

            if(!tools.isValidISODate(minRelease) || !tools.isValidISODate(maxRelease)){
                return res.status(400).json({error: "Invalid date requested"})
            }

            const requestedFields: string[] = fields ? fields.split(",") : allowedFields
            const validFields: string[] = requestedFields.filter(field =>allowedFields.includes(field))

            if(!validFields.includes("_id")) validFields.push("-_id")

            const projection: Projection = validFields.reduce((acc: Projection,field)=>{
                acc[field] = 1
                return acc
            }, {"_id": 0} as Projection)
    

            const books = await BookModel.aggregate([
                {$match: filters},
                {
                    $match: {
                      $and: [
                        {
                          $expr: {
                            $gte: ["$release", new Date(minRelease)]
                          }
                        },
                        {
                          $expr: {
                            $lte: ["$release", new Date(maxRelease)]
                          }
                        }
                      ]
                    }
                },
                {$project: projection},
                {$skip: page*limit},
                {$limit: limit}
            ])
            if(books){
                res.status(200).json(books)
            }
        }catch(error:any){
            res.status(500).json({message:error.message})
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
            let {title, author = "Unknown", genre = "None", description = "", release = null} = req.body
            
            if(!title) return res.status(400).json({error: "title required"})
            
            if(!UserController.verifyUser(req,"",["editor"])) return res.status(401).json({message:  `Unauthorized`})
            
            if(release){
                if(!tools.isValidISODate(release))
                    return res.status(400).json({error:"Invalid date"})
            }


            const newBook = new BookModel({
                title: title,
                author: author,
                genre: genre,
                description: description,
                release: release,
                user_id: req.user.id
            })
            await newBook.save()
            res.status(201).json(newBook)
        }
        catch(error:any){
            UserController.HandleMongooseErrors(error,res)
        }
    }

    static async deleteBook(req:any,res:any){
        try{
            const id = req.params
            if(id){
                if(!Types.ObjectId.isValid(id)){
                    return res.status(400).json({message: "Invalid id format"})
                }
            }
            else{
                return res.status(400).json({message: "id is required"})
            }
            if(!UserController.verifyUser(req,"",["editor"])) return res.json(401).send()
            const data = await BookModel.findByIdAndDelete(id)
            if(data){
                res.status(200).json({message:"Book deleted"})
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
            if(!UserController.verifyUser(req,id)) return res.status(401).json({message: "Unauthorized"})
                const book = await BookModel.findById(id)
            const updates = req.body
            const allowedFields = ["title","author","release","genre","description"]
            if(!book) return res.status(404).json({message: "Book not found"})
            for (const key of Object.keys(updates)) {
                if (!allowedFields.includes(key)) {
                    return res.status(400).json({ message: `Cannot update ${key} field` });
                }
                if (key === "release") {
                    if(!tools.isValidISODate(updates[key])){
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
                book[key] = updates[key];
            }
            await book.save()
            return res.status(200).json({book:book})
        }
        catch(error:any){
            UserController.HandleMongooseErrors(error,res)
        }
    }
}