import { NextFunction, Request, Response } from "express";

const makeJson = (key:string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body[`${key}`])
        next()
    }
};

export default makeJson;