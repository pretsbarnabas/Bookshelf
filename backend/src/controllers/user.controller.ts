const UserModel = require("../models/user.model")
import jwt, { Secret } from "jsonwebtoken"
import bcrypt from "bcrypt"
import * as tools from "../tools/tools"
import {Projection} from "../models/projection.model"
import mongoose from "mongoose"
import fs from "fs"
import path from "path"

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
            const token = jwt.sign({username:username,role:user.role,id: user._id},process.env.JWT_SECRET as Secret, {expiresIn: '1h'})
            user._updateContext = "login"
            await user.save()            
            return res.status(200).json({token:token})
        }
        else{
            return res.status(403).json({error: "Invalid user or password"})
        }
    }

    static verifyToken(req:any){
        const token = req.headers["authorization"]
        if(!token) return false
        let verifiedToken = false
        jwt.verify(token,process.env.JWT_SECRET as Secret,(err:any,decoded:any)=>{
            if(err){
                console.log(err)
                verifiedToken = false
            }
            if(decoded){
                req.user = decoded
                verifiedToken = true
            }
        })
        return verifiedToken
    }

    static verifyUser(req:any, userid: string = "",allowedRoles:string[] = ["user","editor"],){
        if(!UserController.verifyToken(req)) return false
        if(req.user.role === "admin") return true
        if(userid){
            if(req.user.id != userid) return false
        }
        let goodrole = false
        allowedRoles.forEach(role => {
            if(req.user.role == role) goodrole = true
        });
        return goodrole
    }

    static uploadImage(req:any,res:any){
        const { imageData, imageName } = req.body;

        if (!imageData || !imageName) {
          return res.status(400).json({ message: 'Base64 image or image name missing' });
        }
        
        
        
        // Strip out the base64 prefix (if present)
        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
        
        // Convert base64 string to a buffer
        const imageBuffer = Buffer.from(base64Data, 'base64');
        
        // Define the path where you want to store the image
        const imagePath = path.join(__dirname, "../../images",imageName)

         // Ensure the images directory exists
         fs.mkdirSync(path.join(__dirname, '../../images'), { recursive: true });

         // Write the image to the filesystem
         fs.writeFile(imagePath, imageBuffer, (err) => {
           if (err) {
             return res.status(500).json({ message: 'Failed to save image', error: err });
           }
           res.status(200).json({ message: 'Image saved successfully', imagePath });
         });
    }

    static getImage(req:any,res:any){
        try {
            const {imageName} = req.params
            const imagePath = path.join(__dirname, "../../images",imageName)

            return res.sendFile(imagePath,(err:any)=>{
                if(err){
                    res.status(404).send("Image not found")
                }
            })

        } catch (error) {
            return res.status(500).json({ message: error });
        }
    }
    
    static async getAllUsers(req:any,res:any){
        try{
            let {username, email, minCreate, maxCreate, minUpdate, maxUpdate, role, fields, page = 0, limit = 10} = req.query

            limit = Number.parseInt(limit)
            page = Number.parseInt(page)
            
            if(Number.isNaN(limit) || Number.isNaN(page) || limit < 1 || page < 0){
                return res.status(400).json({error:"Invalid page or limit"})
            }

            const allowedFields = ["_id","username","role","created_at","updated_at","booklist","last_login"]

            let filters: {username?:RegExp,email?:RegExp,role?:string} = {}

            if(username) filters.username = new RegExp(`${username}`,"i")
            if(email) filters.email = new RegExp(`${email}`,"i")
            if(role) filters.role = role
            
            if(!minCreate) minCreate = tools.minDate()
            if(!maxCreate) maxCreate = tools.maxDate()
            if(!minUpdate) minUpdate = tools.minDate()
            if(!maxUpdate) maxUpdate = tools.maxDate()

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
        try{
            const {id} = req.params
            const {fields} = req.query
            let allowedFields = ["_id","username","created_at","updated_at","last_login","role","booklist"]
            
            if(UserController.verifyUser(req,id)){
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
                res.status(404).json({message: "User not found"})
            }
        }catch(error:any){
            res.status(500).json({message:error.message})
        }
    }

    static async createUser(req:any,res:any){
        try{
            const {username, password, email, role} = req.body

            if(!username || !password || !email || !role) return res.status(400).json({message: "username, password, email, role required"})
            if(role !== "user"){
                if(!UserController.verifyUser(req,"",["admin"])) return res.status(401).json({message: `Unauthorized to create user of role ${role}`})
            }
            if(!tools.IsValidEmail(email)) return res.status(400).json({message: "Invalid email format"})

            const hashed_password = await UserController.hashPassword(password)
            const newUser = new UserModel({
                username: username,
                password_hashed: hashed_password,
                email: email,
                role: role
            })
            await newUser.save()
            res.status(201).json(newUser)
        }catch(error:any){
            UserController.HandleMongooseErrors(error,res)
        }
    }
    
    static async deleteUser(req:any,res:any){
        try{
            const id = req.params
            if(id){
                if(!mongoose.Types.ObjectId.isValid(id)){
                    return res.status(400).json({message: "Invalid id format"})
                }
            }
            else{
                return res.status(400).json({message: "id is required"})
            }
            if(!UserController.verifyUser(req,id)) return res.json(401).send()
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
            const {id} = req.params
            if(id){
                if(!mongoose.Types.ObjectId.isValid(id)){
                    return res.status(400).json({message: "Invalid id format"})
                }
            }
            else{
                return res.status(400).json({message: "id is required"})
            }
            if(!UserController.verifyUser(req,id)) return res.status(401).json({message: "Unauthorized"})
                const user = await UserModel.findById(id)
            const updates = req.body
            const allowedFields = ["username","password","email","booklist"]
            if(!user) return res.status(404).json({message: "User not found"})
            for (const key of Object.keys(updates)) {
                if (!allowedFields.includes(key)) {
                    return res.status(400).json({ message: `Cannot update ${key} field` });
                }
                if (key === "email") {
                    if (!tools.IsValidEmail(updates[key])) {
                        return res.status(400).json({ message: "Invalid email format" });
                    }
                } 
                if (key === "password") {
                    const newPassHash = await UserController.hashPassword(updates[key]);
                    user["password_hashed"] = newPassHash;
                }
                else {
                    user[key] = updates[key];
                }
            }
            user._updateContext = "update"
            await user.save()
            return res.status(200).json({user:user})
        }
        catch(error:any){
            UserController.HandleMongooseErrors(error,res)
        }
    }
    
    static async HandleMongooseErrors(error: any, res:any){
        if(error.code === 11000){
            const duplicateKey = Object.keys(error.keyValue)[0]
            const duplicateValue = error.keyValue[duplicateKey]
            return res.status(400).json({
                message: `${duplicateKey} of value ${duplicateValue} already exists`,
                duplicateKey: duplicateKey,
                duplicateValue: duplicateValue
            })
        }
        if(error.name === "ValidationError"){
            const errors: any = {};
            for (let field in error.errors) {
              errors[field] = error.errors[field].message;
            }
            return res.status(400).json({ errors });
        }
        return res.status(500).json({message:error})
    }
}
