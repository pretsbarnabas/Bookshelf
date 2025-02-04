import {Types} from "mongoose"
const BookModel = require("../models/book.model")

export class BookController{
    
    static async getAllBooks(req:any,res:any){
        try{
            const books = await BookModel.find()
            res.status(200).json(books)
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