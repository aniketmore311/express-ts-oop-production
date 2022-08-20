import { NextFunction, Request, Response } from "express";

type AsyncHandler = (req: Request, res: Response, next?: NextFunction) => Promise<any>

export default AsyncHandler