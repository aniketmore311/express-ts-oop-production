import express, { Application as ExpressApplication, ErrorRequestHandler, Handler } from 'express';
import path from 'path'
import fs from 'fs'
import IController from './types/IController';
import morgan from 'morgan'
import cors from 'cors'
import { container } from 'tsyringe';
import helmet from 'helmet'
import { Logger } from 'winston';
import { IConfig } from 'config';

export default class Application {
    private expressApp: ExpressApplication
    private middlware: Handler[]
    private controllers: IController[]
    private errorHandlers: ErrorRequestHandler[]
    private logger: Logger;
    private config: IConfig;

    constructor(opts: {
        middlware: Handler[],
        controllers: IController[],
        errorHandlers: ErrorRequestHandler[]
    }) {
        this.expressApp = express()
        this.controllers = opts.controllers;
        this.middlware = opts.middlware;
        this.errorHandlers = opts.errorHandlers;
        this.logger = container.resolve<Logger>('Logger');
        this.config = container.resolve<IConfig>('IConfig');
        this.init()
    }

    init() {
        //consts
        const NODE_ENV = this.config.get<string>('env.NODE_ENV')
        const LOG_DIR = this.config.get<string>('application.logDir')

        //default middleware
        this.expressApp.use(cors())
        this.expressApp.use(helmet())
        this.expressApp.use(express.json())
        this.expressApp.use(express.urlencoded({
            extended: false
        }))
        this.expressApp.use(
            morgan('common', {
                stream: {
                    write: (message) => {
                        this.logger.info(message.trim())
                    },
                },
            })
        )
        // in production also log to a file
        if (NODE_ENV == 'production') {
            this.expressApp.use(
                morgan('common', {
                    stream: fs.createWriteStream(path.join(LOG_DIR, 'access.log')),
                })
            )
        }

        //custom middlware
        for (const mid of this.middlware) {
            this.expressApp.use(mid)
        }

        //handlers
        for (const controller of this.controllers) {
            controller.register(this.expressApp)
        }

        //error handlers
        for (const handl of this.errorHandlers) {
            this.expressApp.use(handl)
        }
    }

    getExpressApp() {
        return this.expressApp
    }
}