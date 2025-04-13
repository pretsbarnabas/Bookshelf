import {Schema, model}  from "mongoose"
import { Logger } from "../tools/logger";
import ReviewModel from "./review.model";
import CommentModel from "./comment.model";
import BookModel from "./book.model";
import SummaryModel from "./summary.model";

const userSchema = new Schema({
    username:{
        required: true,
        type: String,
        minLength: 1,
        maxLength: 100,
        unique: true
    },
    password_hashed:{
        required: true,
        type: String
    },
    email:{
        required: true,
        type: String,
        unique: true
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
    last_login:{
        required: true,
        type: Date,
        default: Date.now
    },
    role:{
        required: true,
        type: String,
        enum: ["admin","user","editor"]
    },
    booklist: {
        type: [{
          _id: false,
          book_id: { 
            type: Schema.Types.ObjectId, 
            ref: 'Book', 
            required: true 
          },
          read_status: {
            type: String,
            required: true,
            enum: ["to_read","has_read","is_reading","dropped","favorite"]
          },
          // ... other book-specific fields
        }],
        required: true,
        default: []
      },
    imageUrl:{
        required:false,
        type: String
    }
},{versionKey: false})


userSchema.pre("save", function (next) {
    // @ts-ignore
    if (this._updateContext === "update") {
        this.updated_at = new Date();
    }

    // @ts-ignore
    if (this._updateContext === "login") {
        this.last_login = new Date();
    }

    next();
});

userSchema.post("save",function(next){
    // @ts-ignore
    if (this._updateContext === "update") {
        Logger.info(`${this._id} user saved`)
    }
    
    // @ts-ignore
    if (this._updateContext === "login") {
        Logger.info(`${this._id} user saved`)
    }
})

userSchema.pre("findOneAndDelete",async function(next){
    let find = await UserModel.findOne(this.getFilter()).select("_id").lean()
    if(!find){
        next()
        return
    }
    const userId = find._id
    
    const deletedComments = await CommentModel.deleteMany({user_id: userId})
    if(deletedComments.deletedCount) Logger.info(`Deleted ${deletedComments.deletedCount} comments of user: ${userId}`)
    const deletedReviews = await ReviewModel.deleteMany({user_id: userId})
    if(deletedReviews.deletedCount) Logger.info(`Deleted ${deletedReviews.deletedCount} reviews of user: ${userId}`)

    const deletedSummaries = await SummaryModel.deleteMany({user_id: userId})
    if(deletedSummaries.deletedCount) Logger.info(`Deleted ${deletedSummaries.deletedCount} summaries of user: ${userId}`)
    const deletedBooks = await BookModel.deleteMany({user_id: userId})
    if(deletedBooks.deletedCount) Logger.info(`Deleted ${deletedBooks.deletedCount} books of user: ${userId}`)

    const onReviewLikedBy = await ReviewModel.find({"liked_by": userId})
    if(onReviewLikedBy){
        onReviewLikedBy.forEach(async (review:any) => {
            const existingIndex = await review.liked_by.findIndex((entry:any) => 
                entry === userId
            );
            review.liked_by.splice(existingIndex,1)
            await review.save()
        });
    }
    const onReviewDislikedBy = await ReviewModel.find({"disliked_by": userId})
    if(onReviewDislikedBy){
        onReviewDislikedBy.forEach(async (review:any) => {
            const existingIndex = await review.disliked_by.findIndex((entry:any) => 
                entry === userId
            );
            review.disliked_by.splice(existingIndex,1)
            await review.save()
        });
    } 
    const onCommentDislikedBy = await CommentModel.find({"disliked_by": userId})
    if(onCommentDislikedBy){
        onCommentDislikedBy.forEach(async (comment:any) => {
            const existingIndex = await comment.disliked_by.findIndex((entry:any) => 
                entry === userId
            );
            comment.disliked_by.splice(existingIndex,1)
            await comment.save()
        });
    } 
    const onCommentLikedBy = await CommentModel.find({"liked_by": userId})
    if(onCommentLikedBy){
        onCommentLikedBy.forEach(async (comment:any) => {
            const existingIndex = await comment.liked_by.findIndex((entry:any) => 
                entry === userId
            );
            comment.liked_by.splice(existingIndex,1)
            await comment.save()
        });
    } 
    next()
})

const UserModel = model("UserModel",userSchema,"users")

module.exports = UserModel
export default UserModel