import { Application, Request, Response, Router } from "express"
import { body } from "express-validator";
import Validate from "../lib/middleware/Validate";
import IController from "../types/IController"

export default class HealthController implements IController {

    register(app: Application) {
        const router = Router();
        router.get('/', this.getHealthStatus.bind(this));
        router.get('/healthcheck', this.getHealthStatus.bind(this));
        router.post('/test', [
            body('email').notEmpty().withMessage('email is required'),
            new Validate().use()
        ], this.getHealthStatus.bind(this))
        app.use("/", router)
    }

    public getHealthStatus(req: Request, res: Response) {
        return res.json({
            status: 'ok'
        })
    }
}