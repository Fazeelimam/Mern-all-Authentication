class Errorhandler extends Error{
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (error,req,res,next)=>{
    error.statusCode = error.statusCode || 500;
    error.message = error.message|| "Internal server error";

    if (error.name === "CastError") {
        const message = `Invalid ${error.path}`;
        error = new Errorhandler(message,400)
    }
    if (error.name ==="JsonWebTokenError") {
        const message = "Json Web Token is Invalid, Try Again";
        error = new Errorhandler(message,400)
    }
    if (error.name ==="JsonExpiredError") {
        const message = "Json Web Token is expired, Try Again";
        error = new Errorhandler(message,400)
    }
    if (error.code === 11000) {
        const message = `Duplicate ${Object.keys(error.keyValue)} Entered`
        error = new Errorhandler(message, 400)
    }
    return res.status(error.statusCode).json({
        success:false,
        message: error.message
    })
}

export default Errorhandler;