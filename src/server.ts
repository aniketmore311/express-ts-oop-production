import "reflect-metadata"
import 'make-promises-safe'
import { config as loadEnv } from "dotenv";
loadEnv()
import "./setup/tsyringe"
import Application from "./Application"
import ErrorHandler from "./lib/middleware/ErrorHandler";
import { container } from "tsyringe";
import http from 'http'
import { IConfig } from "config";
import { Logger } from "winston";
import ErrorLogger from "./lib/middleware/ErrorLogger";
import IController from "./types/IController";
import tokens from "./types/tokens";

async function main() {

    const config = container.resolve<IConfig>(tokens.IConfig)
    const logger = container.resolve<Logger>(tokens.Logger)
    const errorLogger = container.resolve<ErrorLogger>(tokens.ErrorLogger);
    const errorHandler = container.resolve<ErrorHandler>(tokens.ErrorHandler);
    const healthController = container.resolve<IController>(tokens.HealthController);
    const notFoundController = container.resolve<IController>(tokens.NotFoundController);

    const port = config.get<string>("server.port");

    const app = new Application({
        controllers: [healthController, notFoundController],
        middlware: [],
        errorHandlers: [errorLogger.use(), errorHandler.use()],
        logger: logger,
        config: config
    });

    const server = http.createServer(app.getExpressApp());

    server.listen(port, () => {
        logger.info(`server started on http://localhost:${port}`)
        logger.debug(`pid: ${process.pid}`)
    })

    function onClose() {
        logger.debug('graceful shutdown started')
        server.close(() => {
            logger.debug('graceful shutdown complete')
            process.exit(1)
        })
    }
    process.on('SIGINT', onClose)
    process.on('SIGTERM', onClose)

}
main().catch(err => {
    console.log(err)
    process.exit(-1)
})

