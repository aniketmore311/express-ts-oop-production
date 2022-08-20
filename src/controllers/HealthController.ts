import { Application, Request, Response, Router } from "express"
import { injectable, singleton } from "tsyringe";
import IController from "../types/IController"

@injectable()
@singleton()
export default class HealthController implements IController {

    register(app: Application) {
        const router = Router();
        router.get('/', this.getHealthStatus.bind(this));
        router.get('/healthcheck', this.getHealthStatus.bind(this));
        app.use("/", router)
    }

    public getHealthStatus(req: Request, res: Response) {
        return res.json({
            status: 'ok'
        })
    }
}