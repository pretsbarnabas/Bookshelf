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
    }
},{versionKey: false})

reviewSchema.pre("save",function(next){
    this.updated_at = new Date()
    next();
})

module.exports = model("ReviewModel",reviewSchema,"reviews")