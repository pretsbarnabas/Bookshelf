

export abstract class Logger{


    static white = "\x1b[37m"
    static yellow = "\x1b[33m"
    static red = "\x1b[31m"
    static magenta = "\x1b[35m"

    static info(text: string){
        console.log(Logger.white,`Library [INFO]: ${text}`)
    }

    static warn(text:string){
        console.log(Logger.yellow,`Library [WARN]: ${text}`)
    }

    static error(text:string){
        console.log(Logger.red,`Library [ERROR]: ${text}`)
    }

    static debug(text:string){
        console.log(Logger.magenta,`Library [DEBUG]: ${text}`)
    }
} 