import { container, instanceCachingFactory } from "tsyringe";
import config, { IConfig } from 'config'
import { Logger } from "winston";
import itk from "../types/tokens";

import loggerFactory from "../lib/utils/loggerFactor";
import ErrorLogger from "../lib/middleware/ErrorLogger";
import ErrorHandler from "../lib/middleware/ErrorHandler";
import Validate from "../lib/middleware/Validate";
import HealthController from "../controllers/HealthController";
import NotFoundController from "../controllers/NotFoundController";

container.register<IConfig>(itk.IConfig, {
    useFactory: instanceCachingFactory<IConfig>((c) => {
        return config
    })
})

container.register<Logger>(itk.Logger, {
    useFactory: instanceCachingFactory<Logger>(c => {
        const config = c.resolve<IConfig>(itk.IConfig);
        const logger = loggerFactory({
            config
        })
        return logger
    })
})

//controllers
container.register<HealthController>(itk.HealthController, {
    useClass: HealthController
})
container.register<NotFoundController>(itk.NotFoundController, {
    useClass: NotFoundController
})

//middleware
container.register<ErrorLogger>(itk.ErrorLogger, {
    useClass: ErrorLogger
})

container.register<ErrorHandler>(itk.ErrorHandler, {
    useClass: ErrorHandler
})

container.register<Validate>(itk.Validate, {
    useClass: Validate
})