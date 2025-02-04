import {Types} from "mongoose"
const CommentModel = require("../models/comment.model")

export class CommentController{
    
    static async getAllComments(req:any,res:any){
        try{
            const comments = await CommentModel.find()
            res.status(200).json(comments)
        }catch(error:any){
            res.status(500).json({message:error.message})
        }
    }

    static async getCommentById(req:any,res:any){
        const {id} = req.params
        try{
            const comment = await CommentModel.findById(id)
            res.status(200).json(comment)
        }catch(error:any){
            res.status(500).json({message:error.message})
        }
    }

    static async createComment(req:any,res:any){
        const comment = req.body
        const newComment = new CommentModel({
            user_id: comment.user_id,
            book_id: comment.book_id,
            comment: comment.comment
        })
        try{
            await newComment.save()
            res.status(201).json(newComment)
        }
        catch(error:any){
            res.status(500).json({message:error.message})
        }
    }

    static async deleteComment(req:any,res:any){
        try{
            const id = req.params
            const data = await CommentModel.findByIdAndDelete(id)
            if(data){
                res.status(200).json({message:"Comment deleted"})
            }
            else{
                res.status(404).json({message:"Comment not found"})
            }
        }
        catch(error:any){
            res.status(500).json({message:error.message})
        }
    }

    static async updateComment(req:any,res:any){
        try{
            const id = req.params
            const comment = req.body
            const data = await CommentModel.findByIdAndUpdate(id,comment)
            if(data){
                res.status(200).json({message:"Comment updated"})
            }
            else{
                res.status(404).json({message:"Comment not found"})
            }
        }
        catch(error:any){
            res.status(500).json({message:error.message})
        }
    }
}