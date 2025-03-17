import jwt, { Secret } from "jsonwebtoken"
import bcrypt from "bcrypt"
import { Logger } from "../tools/logger"
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
        if(!user) return res.status(403).json({error: "Invalid user or password"})
        if(await Authenticator.checkPassword(password,user.password_hashed)){
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