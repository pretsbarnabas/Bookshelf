import {Schema, model}  from "mongoose"
import { Logger } from "../tools/logger"
const ReviewModel = require("./review.model")
const SummaryModel = require("./summary.model")
const UserModel = require("./user.model")


export const bookSchema = new Schema({
    title:{
        required: true,
        type: String,
        minLength: 1,
        maxLength:200
    },
    author:{
        required: true,
        type: String,
        minLength: 1,
        maxLength: 100
    },
    release:{
        type: Date,
        default: null
    },
    genre:{
        required:true,
        type: String,
        enum: ["Crime","Detective","Romance","Erotic","Fantasy","SciFi","Action","Adventure","Mystery","Horror","Comedy","Literary prose","Poetry","Drama","Historical","Children","Philosophical","Religious","None"]
    },
    user_id:{
        required: true,
        type: Schema.Types.ObjectId
    },
    description:{
        required: true,
        type: String,
        maxLength: 10000
    },
    added_at:{
        required: true,
        type: Date,
        default: Date.now
    },
    updated_at:{
        required: true,
        type: Date,
        default: Date.now
    },
    imageUrl:{
        required:false,
        type: String
    },
    score:{
        required:false,
        type: Number,
        min: 1,
        max: 10
    }
},{versionKey: false})

bookSchema.pre("save",function(next){
    this.updated_at = new Date()
    next();
})

bookSchema.pre("findOneAndDelete",async function(next){
    let bookId = (await BookModel.findOne(this.getFilter()).select("_id").lean())!._id

    const deletedSummaries = await SummaryModel.deleteMany({user_id: bookId})
    if(deletedSummaries.deletedCount) Logger.info(`Deleted ${deletedSummaries.deletedCount} summaries of book: ${bookId}`)

    const deletedReviews = await ReviewModel.deleteMany({user_id: bookId})
    if(deletedReviews.deletedCount) Logger.info(`Deleted ${deletedReviews.deletedCount} reviews of book: ${bookId}`)

    const onBooklist = await UserModel.find({"booklist.book_id": bookId})
    if(onBooklist){
        onBooklist.forEach(async (user:any) => {
            const existingIndex = await user.booklist.findIndex((entry:any) => 
                entry.book_id === bookId
            );
            user.booklist.splice(existingIndex,1)
            await user.save()
        });
    }               
    next()
})

bookSchema.pre("deleteMany",async function (next){
    let deleteData = await BookModel.find(this.getFilter()).lean()
    deleteData.forEach(async (data:any)=>{
        await ReviewModel.deleteMany({book_id: data._id})
        await SummaryModel.deleteMany({book_id: data._id})
        const onBooklist = await UserModel.find({"booklist.book_id": data._id})
        if(onBooklist){
            onBooklist.forEach(async (user:any) => {
                const existingIndex = await user.booklist.findIndex((entry:any) => 
                    entry.book_id === data._id
                );
                user.booklist.splice(existingIndex,1)
                await user.save()
            });
        }               
    })
    next()
})

const BookModel = model("BookModel",bookSchema,"books")

module.exports = BookModel