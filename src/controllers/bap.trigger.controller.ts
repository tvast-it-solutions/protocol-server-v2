import { NextFunction, Request, Response } from "express";
import { Locals } from "../interfaces/locals.interface";
import { RequestActions } from "../schemas/configs/actions.app.config.schema";
import logger from "../utils/logger.utils";
import * as AmqbLib from "amqplib";
import { acknowledgeACK, acknowledgeNACK } from "../utils/acknowledgement.utils";
import { BecknErrorType } from "../schemas/becknError.schema";
import { getConfig } from "../utils/config.utils";
import { ClientConfigType } from "../schemas/configs/client.config.schema";
import { RequestCache } from "../utils/cache/request.cache.utils";
import { parseRequestCache } from "../schemas/cache/request.cache.schema";
import { GatewayUtils } from "../utils/gateway.utils";
import { sendSyncResponses } from "../utils/syncResponses.utils";
import { Exception, ExceptionType } from "../models/exception.model";

export const bapClientTriggerHandler = async (req: Request, res: Response<{}, Locals>, next: NextFunction, action: RequestActions) => {
    try {
        const bpp_id: string | undefined=req.body.context.bpp_id;
        const bpp_uri: string | undefined=req.body.context.bpp_uri;
        if((action!=RequestActions.search)&&((!bpp_id)||(!bpp_uri)||(bpp_id=='')||(bpp_uri==''))){
            acknowledgeNACK(res, req.body.context, {
                code: 6781616,
                message: "All triggers other than search requires bpp_id and bpp_uri. \nMissing bpp_id or bpp_uri",
                type: BecknErrorType.contextError,
            });
            return;
        }

        if(getConfig().client.type==ClientConfigType.webhook){
            acknowledgeACK(res, req.body.context);
        }

        await RequestCache.getInstance().cache(parseRequestCache(req.body.context.transaction_id, req.body.context.message_id, action, res.locals.sender!), getConfig().app.actions.requests[action]?.ttl!);
        GatewayUtils.getInstance().sendToNetworkSideGateway(req.body);

        if(getConfig().client.type==ClientConfigType.synchronous){
            sendSyncResponses(res, req.body.context.message_id, action, req.body.context);
        }
    } catch (err) {
        if(err instanceof Exception){
            throw err;
        }

        throw new Exception(ExceptionType.Request_Failed, "BAP Request Failed", 400, err);
    }
};

export const bapClientTriggerSettler = async (message: AmqbLib.ConsumeMessage | null) => {
    try {
    }
    catch (err) {
        logger.error(err)
    }
}

// TODO: create bapClientTriggerSettler()