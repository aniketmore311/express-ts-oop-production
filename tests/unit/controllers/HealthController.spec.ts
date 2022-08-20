import express, { Application } from "express"
import HealthController from '../../../src/controllers/HealthController'
import request from 'supertest'

describe('HealthController', () => {
    const app = express()

    beforeAll(() => {
        new HealthController().register(app)
    })

    it('should return 200 when GET /', async () => {
        //setup
        //action
        const resp = await request(app).get('/')
        //assert
        expect(resp.statusCode).toEqual(200)
    })

    it('should return 200 when GET /healthcheck', async () => {
        //setup
        //action
        const resp = await request(app).get('/healthcheck')
        //assert
        expect(resp.statusCode).toEqual(200)
    })
})