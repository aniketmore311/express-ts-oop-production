import { Handler, NextFunction, Request } from "express";
import AsyncHandler from "../../types/AsyncHandler";

export default function catchAsync(fn: AsyncHandler): Handler {
    return function (req, res, next) {
        fn(req, res, next).catch(next)
    }
}
