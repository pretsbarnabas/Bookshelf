import {Types} from "mongoose"
const UserModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
import * as tools from "../tools/tools"
import {Projection} from "../models/projection.model"

export class UserController{

    private static saltrounds = 10

    
    private static hashPassword(password:string){
        return bcrypt.hash(password, this.saltrounds)
    }
    
    private static checkPassword(password:string,hash:string){
        return bcrypt.compare(password,hash)
    }

    static async login(req:any,res:any){
        const {username, password} = req.body
        const user = await UserModel.findOne({username:username})
        if(this.checkPassword(password,user.password_hashed)){
            const token = jwt.sign({username:username,role:user.role},process.env.JWT_SECRET)
            res.status(200).json({token:token})
        }
    }
    
    static async getAllUsers(req:any,res:any){
        try{
            let {username, email, minCreate, maxCreate, minUpdate, maxUpdate, role, fields, page = 1, limit = 10} = req.query
            
            limit = Number.parseInt(limit)
            page = Number.parseInt(page)
            
            if(Number.isNaN(limit) || Number.isNaN(page) || limit < 1 || page < 0){
                return res.status(400).json({error:"Invalid page or limit"})
            }

            const allowedFields = ["username","role","createdAt","updatedAt"]

            let filters: {username?:RegExp,email?:string,role?:string} = {}

            if(username) filters.username = new RegExp(`${username}`,"i")
            if(email) filters.email = email
            if(role) filters.role = role
            
            if(!minCreate) minCreate = new Date(0).toISOString().slice(0,-5)
            if(!maxCreate) maxCreate = new Date().toISOString().slice(0,-5)
            if(!minUpdate) minUpdate = new Date(0).toISOString().slice(0,-5)
            if(!maxUpdate) maxUpdate = new Date().toISOString().slice(0,-5)

            if(!tools.isValidISODate(minCreate)|| !tools.isValidISODate(maxCreate) || !tools.isValidISODate(minUpdate || !tools.isValidISODate(maxUpdate))){
                return res.status(400).json({error:"Invalid date requested"})
            }

            const requestedFields: string[] = fields ? fields.split(",") : allowedFields
            const validFields: string[] = requestedFields.filter(field =>allowedFields.includes(field))

            if(!validFields.includes("_id")) validFields.push("-_id")

            const projection: Projection = validFields.reduce((acc: Projection,field)=>{
                acc[field] = 1
                return acc
            }, {"_id": 0} as Projection)

            if(validFields.length === 0) return res.status(400).json({error:"Invalid fields requested"})

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
            password_hashed: this.hashPassword(user.password),
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
