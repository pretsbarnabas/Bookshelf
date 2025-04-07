import jwt, { Secret } from "jsonwebtoken"
import bcrypt from "bcrypt"
import { Logger } from "../tools/logger"
import { ErrorHandler } from "../tools/errorhandler"
const UserModel = require("../models/user.model")


export class Authenticator{
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
        if(!user) return res.status(403).json({message: "Invalid username or password"})
        if(await Authenticator.checkPassword(password,user.password_hashed)){
            const token = jwt.sign({username:username,role:user.role,id: user._id},process.env.JWT_SECRET as Secret, {expiresIn: "7d"})
            user._updateContext = "login"
            await user.save()            
            return res.status(200).json({token:token})
        }
        else{
            return res.status(403).json({message: "Invalid username or password"})
        }
    }

    static async refreshToken(req:any,res:any){
        try {
            let {token} = req.body
            if(!token){
                if(req.headers["authorization"]){
                   token = req.headers["authorization"].split(" ").pop()
                }
            }
            if(!token) throw new Error("No token sent in request")
            
            let verifiedToken = false
            jwt.verify(token, process.env.JWT_SECRET as Secret,(err:any,decoded:any)=>{
                if(err){
                    throw new Error("Incorrect token")
                }
                if(decoded){
                    req.user = decoded
                    verifiedToken = true
                }
            })
            if(verifiedToken){
                const newToken = jwt.sign({username: req.user.username, role:req.user.role,id: req.user.id},process.env.JWT_SECRET as Secret,{expiresIn: "7d"})
                const user = await UserModel.findOne({username:req.user.username})
                user._updateContext = "login"
                await user.save()
                return res.status(200).json({token:newToken})
            }
            
        } catch (error:any) {
            Logger.error(error)
            ErrorHandler.HandleMongooseErrors(error,res)
        }
    }

    static verifyToken(req:any){
        if(!req.headers["authorization"]) return false
        const token = req.headers["authorization"].split(" ").pop()
        if(!token) return false
        let verifiedToken = false
        jwt.verify(token,process.env.JWT_SECRET as Secret,(err:any,decoded:any)=>{
            if(err){
                Logger.error(err)
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
        if(!Authenticator.verifyToken(req)) return false
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
}