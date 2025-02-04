import {Types} from "mongoose"
const UserModel = require("../models/user.model")

export class UserController{

    static async getAllUsers(req:any,res:any){
        try{
            const users = await UserModel.find()
            res.status(200).json(users)
        }catch(error:any){
            res.status(500).json({message:error.message})
        }
    }

    static async getUserById(req:any,res:any){
        const {id} = req.params
        try{
            const user = await UserModel.findById(id)
            res.status(200).json(user)
        }catch(error:any){
            res.status(500).json({message:error.message})
        }
    }

    static async createUser(req:any,res:any){
        const user = req.body
        const newUser = new UserModel({
            username: user.username,
            password_hashed: user.password_hashed,
            email: user.email,
            role: user.role,
            booklist: user.booklist
        })
        try{
            await newUser.save()
            res.status(201).json(newUser)
        }catch(error:any){
            res.status(500).json({message:error.message})
        }
    }

    static async deleteUser(req:any,res:any){
        try{
            const id = req.params
            const data = await UserModel.findByIdAndDelete(id)
            if(data){
                res.status(200).json({message:"User deleted"})
            }
            else{
                res.status(404).json({message:"User not found"})
            }
        }
        catch(error:any){
            res.status(500).json({message:error.message})
        }
    }

    static async updateUser(req:any,res:any){
        try{
            const id = req.params
            const user = req.body
            const data = await UserModel.findByIdAndUpdate(id,user,{new:true})
            if(data){
                res.status(200).json(data)
            }
            else{
                res.status(404).json({message:"User not found"})
            }
        }
        catch(error:any){
            res.status(500).json({message:error.message})
        }
    }
}
