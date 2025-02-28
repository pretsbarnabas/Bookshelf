import {Schema, model}  from "mongoose"

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
        required: true,
        type: Date
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
    }
},{versionKey: false})

bookSchema.pre("save",function(next){
    this.updated_at = new Date()
})

module.exports = model("BookModel",bookSchema,"books")