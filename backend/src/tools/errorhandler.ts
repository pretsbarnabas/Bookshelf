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
            const errors: any = {};
            for (let field in error.errors) {
              errors[field] = error.errors[field].message;
            }
            return res.status(400).json({ errors });
        }
        Logger.error(JSON.stringify(error))
        return res.status(500).json({message:error})
    }

}
