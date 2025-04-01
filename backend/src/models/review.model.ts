import {Schema, model, Types}  from "mongoose"
import { Logger } from "../tools/logger"
const BookModel = require("./book.model")

const reviewSchema = new Schema({
    book_id:{
        required: true,
        type: Schema.Types.ObjectId
    },
    user_id:{
        required: true,
        type: Schema.Types.ObjectId
    },
    score:{
        required: true,
        type: Number,
        min: 1,
        max: 10
    },
    content:{
        required: false,
        type: String,
        maxLength: 10000,
        default: null
    },
    created_at:{
        required: true,
        type: Date,
        default: Date.now
    },
    updated_at:{
        required: true,
        type: Date,
        default: Date.now
    },
    liked_by:{
        required: true,
        type: [Types.ObjectId],
        default: []
    },
    disliked_by:{
        required: true,
        type: [Types.ObjectId],
        default: []
    },
    like_score:{
        required: true,
        default: 0,
        type: Number
    }
},{versionKey: false})

reviewSchema.pre("save",function(next){
    this.updated_at = new Date()
    this.like_score = this.liked_by.length - this.disliked_by.length
    next();
})

reviewSchema.post("save",async function(next){
    const RelevantReviews = await ReviewModel.aggregate([{$match: {book_id: this.book_id}}])
    const SumScore = RelevantReviews.reduce((sum: Number,item:any)=>{
        return sum += item.score
    },0)
    const avgScore = SumScore/RelevantReviews.length 
    const Book = await BookModel.findById(this.book_id)
    Book.score = avgScore
    await Book.save()
})

const ReviewModel = model("ReviewModel",reviewSchema,"reviews")

module.exports = ReviewModel