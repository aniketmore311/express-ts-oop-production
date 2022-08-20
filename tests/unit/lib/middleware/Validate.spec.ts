import express, { Response } from 'express'
import {
    body
} from 'express-validator'
import request from 'supertest'
import Validate from '../../../../src/lib/middleware/Validate'

describe('Validate', () => {
    const app = express()

    beforeAll(() => {

        app.post('/testvalidate', [
            body('email').notEmpty().withMessage('email is required'),
            new Validate().use()
        ], (req: any, res: any, next: any) => {
            return res.json({
                message: "hello"
            })
        })

        app.use((err: any, req: any, resp: Response, next: any) => {
            return resp.status(err.statusCode).json({
                statusCode: err.statusCode,
                message: err.message
            })
        })
    })

    it('should set proper statusCode to validation Error', async () => {
        const resp = await request(app).post('/testvalidate').send({})
        expect(resp.statusCode).toEqual(400)
    })

    it('should set proper message to validation Error', async () => {
        const resp = await request(app).post('/testvalidate').send({})
        expect(resp.body.message).toEqual("email is required")
    })
})