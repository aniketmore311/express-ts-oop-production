import express from 'express'
import createHttpError from 'http-errors'
import ErrorHandler from '../../../../src/lib/middleware/ErrorHandler'
import request from 'supertest'

describe('ErrorHandler', () => {
    const app = express()

    beforeAll(() => {
        app.get('/expected', () => {
            throw new createHttpError.BadRequest('bad request')
        })
        app.get('/unexpected', () => {
            throw new Error('secret')
        })
        app.use(new ErrorHandler().use())
    })

    it('should set respective status on expected Error', async () => {
        const resp = await request(app).get('/expected')
        expect(resp.statusCode).toEqual(400)
    })

    it('should set statusCode on response body on expected Error', async () => {
        const resp = await request(app).get('/expected')
        expect(resp.body.statusCode).toEqual(400)
    })

    it('should set message on response body on expected Error', async () => {
        const resp = await request(app).get('/expected')
        expect(resp.body.message).toEqual("bad request")
    })

    it('should set statusCode 500 on unexpected Error', async () => {
        const resp = await request(app).get('/unexpected')
        expect(resp.statusCode).toEqual(500)
    })

    it('should set statusCode 500 on response body on unexpected Error', async () => {
        const resp = await request(app).get('/unexpected')
        expect(resp.body.statusCode).toEqual(500)
    })

    it('should set message on response body on unexpected Error', async () => {
        const resp = await request(app).get('/unexpected')
        expect(resp.body.message).not.toContain("secret")
    })
})