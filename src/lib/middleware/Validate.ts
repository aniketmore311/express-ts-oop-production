import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import IMiddleware from "../../types/IMiddleware";
import { validationResult } from 'express-validator'

export default class Validate implements IMiddleware {
    constructor() {
        this.use = this.use.bind(this)
    }

    use() {
        return function (req: Request, res: Response, next: NextFunction) {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                const errArr = errors.array()
                const message = errArr[0].msg
                const err = new createHttpError.BadRequest(message)
                next(err)
            }
            next()
        }
    }
}