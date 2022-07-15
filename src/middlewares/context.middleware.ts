import { NextFunction, Request, Response } from "express";
import { buildContext } from "../utils/context.utils";

export async function contextMiddleware(req: Request, res: Response, next: NextFunction, action: string) {
    try {
        const context=buildContext(req.body.context, action);
        req.body.context=context;
        // TODO: add sender details.
        next();
    } catch (error) {
        next(error);
    }
}