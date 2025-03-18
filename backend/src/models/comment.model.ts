import {Schema, model}  from "mongoose"
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
    }
},{versionKey: false})

commentSchema.pre("save",function(next){
    this.updated_at = new Date()
    next();
})

commentSchema.post("save",function(){
    Logger.info(`${this._id} comment saved`)
})

module.exports = model("CommentModel",commentSchema,"comments")