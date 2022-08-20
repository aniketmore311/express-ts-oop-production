import "reflect-metadata"
import { config as loadEnv } from "dotenv";
loadEnv()
import "./setup/tsyringe"
import Application from "./Application"
import HealthController from "./controllers/HealthController";
import NotFoundController from "./controllers/NotFoundController";
import ErrorHandler from "./lib/middleware/ErrorHandler";
import { container } from "tsyringe";
import http from 'http'
import { IConfig } from "config";
import { Logger } from "winston";
import ErrorLogger from "./lib/middleware/ErrorLogger";

async function main() {

    const config = container.resolve<IConfig>('IConfig')
    const logger = container.resolve<Logger>('Logger')
    const errorLogger = container.resolve<ErrorLogger>('ErrorLogger');

    const port = config.get<string>("server.port");

    const app = new Application({
        controllers: [new HealthController(), new NotFoundController()],
        middlware: [],
        errorHandlers: [errorLogger.use(), new ErrorHandler().use()]
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

