import {Types} from "mongoose"
const ReviewModel = require("../models/review.model")

export class ReviewController{

    static async getAllReviews(req:any,res:any){
        try{
            const reviews = await ReviewModel.find()
            res.status(200).json(reviews)
        }catch(error:any){
            res.status(500).json({message:error.message})
        }
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