import { ErrorRequestHandler } from 'express'

export default interface IErrorHandler {
    use: <T>(opts: T)=> ErrorRequestHandler;
}