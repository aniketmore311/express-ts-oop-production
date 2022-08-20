import { Request, Response, NextFunction } from "express";
import IErrorHandler from "../../types/IErrorHandler";

export default class ErrorHandler implements IErrorHandler {
    constructor(){
        this.use = this.use.bind(this)
    }
    use() {
        return function (err: any, req: Request, res: Response, next: NextFunction) {
            let status = 500
            let message = 'Something went wrong'

            if (err.statusCode) {
                status = err.statusCode
                message = err.message
            }
            const resp = {
                statusCode: status,
                message,
            }
            res.status(status).json(resp)
            return
        }
    }
}