import express from 'express'

export default interface IController{
    register: (app: express.Application) => void
}