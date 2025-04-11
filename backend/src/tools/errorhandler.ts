import { Logger } from "./logger";

export class ErrorHandler{
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
            const errors: Array<string> = [];
            for (let field in error.errors) {
              errors.push(`${error.errors[field].message}`)
            }
            return res.status(400).json({ message: errors });
        }
        if(error.message === "Unauthorized"){
            return res.status(401).json({message: "Unauthorized"})
        }
        if(error.message.includes("not found")){
            return res.status(404).json({message: error.message})
        }
        Logger.error(error.message)
        return res.status(400).json({message:error.message})
    }

}
