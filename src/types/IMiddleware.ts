import { Handler } from 'express'

export default interface IMiddleware {
    use: <T>(opts: T) => Handler
}