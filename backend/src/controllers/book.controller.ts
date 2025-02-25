import {Types} from "mongoose"
const BookModel = require("../models/book.model")
import { bookSchema } from "../models/book.model"
import * as tools from "../tools/tools"
import { Projection } from "../models/projection.model"

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
                if(!genrePath.options.enum.includes(genre)){
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
        const {id} = req.params
        try{
            const book = await BookModel.findById(id)
            res.status(200).json(book)
        }catch(error:any){
            res.status(500).json({message:error.message})
        }
    }

    static async createBook(req:any,res:any){
        const book = req.body
        const newBook = new BookModel({
            title: book.title,
            author: book.author,
            release: book.release,
            genre: book.genre,
            user_id: book.user_id,
            description: book.description
        })
        try{
            await newBook.save()
            res.status(201).json(newBook)
        }
        catch(error:any){
            res.status(500).json({message:error.message})
        }
    }

    static async deleteBook(req:any,res:any){
        try{
            const id = req.params
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
            const id = req.params
            const book = req.body
            const updatedBook = await BookModel.findByIdAndUpdate(id,book,{new:true})
            if(updatedBook){
                res.status(200).json(updatedBook)
            }
            else{
                res.status(404).json({message:"Book not found"})
            }
        }
        catch(error:any){
            res.status(500).json({message:error.message})
        }
    }
}