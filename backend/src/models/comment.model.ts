import {Schema, model}  from "mongoose"

const commentSchema = new Schema({
    _id:{
        required: true,
        type: Schema.Types.ObjectId,
        unique: true
    },
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
})

module.exports = model("CommentModel",commentSchema,"comments")