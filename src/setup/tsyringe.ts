import { container, instanceCachingFactory } from "tsyringe";
import config, { IConfig } from 'config'
import loggerFactory from "../lib/utils/loggerFactor";
import { Logger } from "winston";
import ErrorLogger from "../lib/middleware/ErrorLogger";

container.register<IConfig>("IConfig", {
    useFactory: instanceCachingFactory<IConfig>((c) => {
        return config
    })
})
container.register<Logger>("Logger", {
    useFactory: instanceCachingFactory<Logger>(c => {
        const config = c.resolve<IConfig>('IConfig');
        const logger = loggerFactory({
            config
        })
        return logger
    })
})

container.register<ErrorLogger>('ErrorLogger', {
    useClass: ErrorLogger
})