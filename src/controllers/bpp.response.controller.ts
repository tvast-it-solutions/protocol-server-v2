import { Request, Response, NextFunction } from "express"
import { Locals } from "../interfaces/locals.interface";
import { ResponseActions } from "../schemas/configs/actions.app.config.schema";
import { MQClient } from "../utils/rbtmq.utils";

export const bppClientResponseHandler = async(req : Request, res : Response<{}, Locals>, next : NextFunction, action: ResponseActions) => {
    try {
        
    } catch (err) {
    
    }
}

// TODO: create bppClientResponseSettler()