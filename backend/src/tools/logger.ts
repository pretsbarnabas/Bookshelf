

export abstract class Logger{


    static white = "\x1b[37m"
    static yellow = "\x1b[33m"
    static red = "\x1b[31m"
    static magenta = "\x1b[35m"

    static info(text: string){
        console.log(`[${new Date().toLocaleString()}] [INFO] Library: ${text}`,Logger.white)
    }

    static warn(text:string){
        console.log(`[${new Date().toLocaleString()}] [WARN] Library: ${text}`,Logger.yellow)
    }

    static error(text:string){
        console.log(`[${new Date().toLocaleString()}] [ERROR] Library: ${text}`,Logger.red)
    }

    static debug(text:string){
        console.log(`[${new Date().toLocaleString()}] [DEBUG] Library: ${text}`,Logger.magenta)
    }
} 