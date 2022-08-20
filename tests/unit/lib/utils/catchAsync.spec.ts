import express, { Response } from 'express'
import request from 'supertest'
import catchAsync from '../../../../src/lib/utils/catchAsync'

describe('catchAsync', () => {
    it('should forward error when thrown inside async handler', async () => {
        //setup
        const app = express()
        app.get('/test', catchAsync(async () => {
            throw new Error('test error')
        }))
        app.use((err: any, req: any, res: Response, next: any) => {
            return res.status(500).json({
                message: err.message
            })
        })
        //action
        const resp = await request(app).get('/test')
        //assert
        expect(resp.status).toEqual(500)
        expect(resp.body).toEqual({
            message: 'test error'
        })

    })
})