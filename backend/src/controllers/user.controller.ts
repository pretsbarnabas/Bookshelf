const UserModel = require("../models/user.model")
import jwt, { Secret } from "jsonwebtoken"
import bcrypt from "bcrypt"
import * as tools from "../tools/tools"
import {Projection} from "../models/projection.model"

export class UserController{

    static saltrounds = 10

    
    static async hashPassword(password:string){
        return await bcrypt.hash(password, this.saltrounds)
    }
    
    static async checkPassword(password:string,hash:string){
        return await bcrypt.compare(password,hash)
    }

    static async login(req:any,res:any){
        const {username, password} = req.body
        if(!username || !password) return res.status(400).json({error: "Bad request body, missing either username or password"})
        const user = await UserModel.findOne({username:username})
        if(!user) return res.status(403).json({error: "Invalid user or password"})
        if(await UserController.checkPassword(password,user.password_hashed)){
            const token = jwt.sign({username:username,role:user.role},process.env.JWT_SECRET as Secret, {expiresIn: '1h'})
            return res.status(200).json({token:token})
        }
        else{
            return res.status(403).json({error: "Invalid user or password"})
        }
    }

    static verifyToken(req:any){
        const token = req.headers["authorization"]
        console.log(token)
        if(!token) return false
        let verifiedToken = false
        jwt.verify(token,process.env.JWT_SECRET as Secret,(err:any,decoded:any)=>{
            if(err){
                verifiedToken = false
            }
            if(decoded){
                req.user = decoded
                verifiedToken = true
            }
        })
        return verifiedToken
    }

    static verifyUser(req:any,allowedRoles:string[]){
        if(!UserController.verifyToken(req)) return false
        let goodrole = false
        allowedRoles.forEach(role => {
            if(req.user.role == role) goodrole = true
        });
        if(req.user.role === "admin") goodrole = true
        return goodrole
    }
    
    static async getAllUsers(req:any,res:any){
        try{
            let {username, email, minCreate, maxCreate, minUpdate, maxUpdate, role, fields, page = 0, limit = 10} = req.query

            limit = Number.parseInt(limit)
            page = Number.parseInt(page)
            
            if(Number.isNaN(limit) || Number.isNaN(page) || limit < 1 || page < 0){
                return res.status(400).json({error:"Invalid page or limit"})
            }

            const allowedFields = ["_id","username","role","created_at","updated_at"]

            let filters: {username?:RegExp,email?:string,role?:string} = {}

            if(username) filters.username = new RegExp(`${username}`,"i")
            if(email) filters.email = email
            if(role) filters.role = role
            
            if(!minCreate) minCreate = new Date(0).toISOString().slice(0,-5)
            if(!maxCreate) maxCreate = new Date(Date.now() + 2 * (60*60*1000)).toISOString().slice(0,-5)
            if(!minUpdate) minUpdate = new Date(0).toISOString().slice(0,-5)
            if(!maxUpdate) maxUpdate = new Date(Date.now() + 2 * (60*60*1000)).toISOString().slice(0,-5)

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

            const users = await UserModel.aggregate([
                {$match: filters},
                {
                    $match: {
                      $and: [
                        {
                          $expr: {
                            $gte: ["$created_at", new Date(minCreate)]
                          }
                        },
                        {
                          $expr: {
                            $lte: ["$created_at", new Date(maxCreate)]
                          }
                        },
                        {
                          $expr: {
                            $gte: ["$updated_at", new Date(minUpdate)]
                          }
                        },
                        {
                          $expr: {
                            $lte: ["$updated_at", new Date(maxUpdate)]
                          }
                        }
                      ]
                    }
                },
                {$project: projection},
                {$skip: page*limit},
                {$limit: limit}
            ])
            if(users){
                res.status(200).json(users)
            }
        }catch(error:any){
            res.status(500).json({message:error.message})
        }
    }

    static async getUserById(req:any,res:any){
        res.setHeader("Custom-Header","Authorization")
        try{
            const {id} = req.params
            const {fields} = req.query
            let allowedFields = ["_id","username","created_at","updated_at","last_login","role","booklist"]
            
            if(UserController.verifyUser(req,["user","editor","admin"])){
                allowedFields.push("email", "password_hashed")
            }


            const requestedFields: string[] = fields ? fields.split(",") : allowedFields
            const validFields: string[] = requestedFields.filter(field =>allowedFields.includes(field))

            if(validFields.length === 0) return res.status(400).json({error:"Invalid fields requested"})
            
            if(!validFields.includes("_id")) validFields.push("-_id")

            const data = await UserModel.findById(id).select(validFields)
            if(data){
                res.status(200).json(data)
            }
            else{
                res.status(404).send()
            }
        }catch(error:any){
            res.status(500).json({message:error.message})
        }
    }

    static async createUser(req:any,res:any){
        const user = req.body
        const hashed_password = await UserController.hashPassword(user.password)
        const newUser = new UserModel({
            username: user.username,
            password_hashed: hashed_password,
            email: user.email,
            role: user.role
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
