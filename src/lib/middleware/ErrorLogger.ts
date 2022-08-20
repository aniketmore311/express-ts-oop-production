import { Request, Response, NextFunction } from "express";
import { inject, injectable, singleton } from "tsyringe";
import { Logger } from "winston";
import IErrorHandler from "../../types/IErrorHandler";

@injectable()
@singleton()
export default class ErrorLogger implements IErrorHandler {
    constructor(
        @inject('Logger')
        private readonly logger: Logger
    ) {
        this.use = this.use.bind(this)
    }
    use() {
        const logger = this.logger;
        return function (err: any, req: Request, res: Response, next: NextFunction) {
            logger.error(err.message, {
                error: {
                    message: err.message,
                    stack: err.stack,
                    statusCode: err.statusCode || 500,
                },
            })
            logger.debug(err.stack)
            next(err)
        }
    }
}