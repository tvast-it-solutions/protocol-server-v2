import { NextFunction, Request, Response } from "express";
import { RequestActions } from "../schemas/configs/actions.app.config.schema";
import logger from "../utils/logger.utils";
import * as AmqbLib from "amqplib";

export const bppNetworkRequestHandler = async (req: Request, res: Response, next: NextFunction, action: RequestActions) => {
    try {

    }
    catch (err) {

    }
};

export const bppNetworkRequestSettler = async (msg: AmqbLib.ConsumeMessage | null) => {
    try {

    }
    catch (err) {
        logger.error(err)
    }
}


// TODO: create bppNetworkRequestSettler()