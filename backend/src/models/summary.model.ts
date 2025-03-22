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

summarySchema.pre("save",function(next){
    this.updated_at = new Date()
    next();
})

module.exports = model("SummaryModel",summarySchema,"summaries")