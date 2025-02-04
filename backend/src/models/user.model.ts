import {Schema, model}  from "mongoose"

const userSchema = new Schema({
    _id:{
        required: true,
        type: Schema.Types.ObjectId
    },
    username:{
        required: true,
        type: String,
        minLength: 1,
        maxLength: 100
    },
    password_hashed:{
        required: true,
        type: String
    },
    email:{
        required: true,
        type: String
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
    booklist:{
        required:true,
        type: Array
    }
})

module.exports = model("UserModel",userSchema,"users")