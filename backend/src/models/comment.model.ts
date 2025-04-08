import {Schema, model, Types}  from "mongoose"
import { Logger } from "../tools/logger";

const commentSchema = new Schema({
    review_id:{
        required: true,
        type: Schema.Types.ObjectId
    },
    user_id:{
        required: true,
        type: Schema.Types.ObjectId
    },
    content:{
        required: true,
        type: String,
        minLength: 1,
        maxLength: 1000
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

commentSchema.pre("save",function(next){
    this.updated_at = new Date()
    this.like_score = this.liked_by.length - this.disliked_by.length
    next();
})

commentSchema.post("save",function(){
    Logger.info(`${this._id} comment saved`)
})

const CommentModel = model("CommentModel",commentSchema,"comments")
module.exports = CommentModel
export default CommentModel