import { NextFunction, Request, Response } from "express";
import { Locals } from "../interfaces/locals.interface";
import { RequestActions } from "../schemas/configs/actions.app.config.schema";
import logger from "../utils/logger.utils";
import * as AmqbLib from "amqplib";

export const bapClientTriggerHandler = async (req: Request, res: Response<{}, Locals>, next: NextFunction, action: RequestActions) => {
    try {
        
    } catch (err) {
    
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