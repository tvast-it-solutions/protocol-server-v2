import { NextFunction, Request, Response } from "express"
import { Locals } from "../interfaces/locals.interface"
import { ResponseActions } from "../schemas/configs/actions.app.config.schema"
import logger from "../utils/logger.utils"
import * as AmqbLib from "amqplib";

export const bapNetworkResponseHandler = async (req: Request, res: Response<{}, Locals>, next: NextFunction, action: ResponseActions) => {
    try {

    } catch (err) {

    }
}

export const bapNetworkResponseSettler = (msg: AmqbLib.ConsumeMessage | null) => {
    try {

    }
    catch (err) {
        logger.error(err)    
    }
}

// TODO: create bapNetworkResponseSettler()