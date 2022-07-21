import { Request, Response, NextFunction } from "express"
import { Locals } from "../interfaces/locals.interface";
import { ResponseActions } from "../schemas/configs/actions.app.config.schema";
import logger from "../utils/logger.utils";
import * as AmqbLib from "amqplib";

export const bppClientResponseHandler = async (req: Request, res: Response<{}, Locals>, next: NextFunction, action: ResponseActions) => {
    try {

    } catch (err) {

    }
}

export const bppClientResponseSettler = (msg: AmqbLib.ConsumeMessage | null) => {
    try {

    } catch (error) {
        logger.error(error)
    }
}

// TODO: create bppClientResponseSettler()