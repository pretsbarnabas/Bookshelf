import {Schema, model}  from "mongoose"

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
    }
},{versionKey: false})

module.exports = model("ReviewModel",reviewSchema,"reviews")