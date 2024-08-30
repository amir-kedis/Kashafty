class AppError extends Error{

    public readonly statusCode: number;
    public readonly status: string;
    public readonly isOperational: boolean;
    public readonly arabicMessage: string;

    constructor(statusCode: number, message: string, arabicMessage: string) {

        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
        this.arabicMessage = arabicMessage;


        Error.captureStackTrace(this, this.constructor);
    }
}


export default AppError;