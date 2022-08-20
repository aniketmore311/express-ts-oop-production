import express, { NextFunction, Response } from 'express'
import NotFoundController from '../../../src/controllers/NotFoundController'
import request from 'supertest'

describe('NotFoundController', () => {
    const app = express()

    beforeAll(() => {
        new NotFoundController().register(app)
        app.use((err: any, req: any, res: Response, next: NextFunction) => {
            res.status(err.statusCode).json({
                statusCode: err.statusCode,
                message: err.message
            })
            return
        })
    })

    it('should set status 404 when route not found', async () => {
        const resp = await request(app).get('/none')
        expect(resp.statusCode).toEqual(404)
    })
})
