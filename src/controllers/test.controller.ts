import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../interfaces/authenticatedRequest.interface";
import { parseRequestCache } from "../schemas/cache/request.cache.schema";
import { RequestCache } from "../utils/cache/request.cache.utils";
import { getConfig } from "../utils/config.utils";

export async function testController(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    
    // // Request Cache Code.
    // const requestCache=RequestCache.getInstance();
    // const oldRequest=await requestCache.check(req.body.context.message_id, req.body.context.action);
    // console.log(oldRequest)
    // const requestData=parseRequestCache(
    //     req.body.context.transaction_id, 
    //     req.body.context.message_id, 
    //     req.body.context.action,
    //     req.sender!, 
    //     undefined
    // );
    // const cacheResult=await requestCache.cache(requestData, getConfig().app.actions.requests.init!.ttl);
    // console.log(cacheResult);
    // // Request Cache Code End.

    res.status(200).json({
        message: {
            ack: {
                status: "ACK"
            }
        }
    });
}