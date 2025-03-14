

export abstract class Logger{


    static white = "\x1b[37m"
    static yellow = "\x1b[33m"
    static red = "\x1b[31m"
    static magenta = "\x1b[35m"

    static info(text: string){
        console.log(Logger.white,`[${new Date().toISOString()}] [INFO] Library: ${text}`)
    }

    static warn(text:string){
        console.log(Logger.yellow,`[${new Date().toISOString()}] [WARN] Library: ${text}`)
    }

    static error(text:string){
        console.log(Logger.red,`[${new Date().toISOString()}] [ERROR] Library: ${text}`)
    }

    static debug(text:string){
        console.log(Logger.magenta,`[${new Date().toISOString()}] [DEBUG] Library: ${text}`)
    }
} 