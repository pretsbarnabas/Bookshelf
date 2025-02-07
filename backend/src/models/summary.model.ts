import {Schema, model}  from "mongoose"

const summarySchema = new Schema({
    book_id:{
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
        minLength: 1
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

module.exports = model("SummaryModel",summarySchema,"summaries")