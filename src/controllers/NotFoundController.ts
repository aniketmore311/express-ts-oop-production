import { Application, NextFunction, Request, Response, Router } from "express"
import createHttpError from "http-errors"
import { injectable, singleton } from "tsyringe"
import IController from "../types/IController"

@injectable()
@singleton()
export default class NotFoundController implements IController {

    register(app: Application) {
        app.use(this.handleNotFound.bind(this))
    }

    public handleNotFound(req: Request, res: Response, next: NextFunction) {
        const err = new createHttpError.NotFound('resource not found')
        next(err)
    }
}