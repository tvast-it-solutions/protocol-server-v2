import { NextFunction, Request, Response } from "express";
import { Locals } from "../interfaces/locals.interface";
import { RequestActions } from "../schemas/configs/actions.app.config.schema";

export const bapClientTriggerHandler = async (req: Request, res: Response<{}, Locals>, next: NextFunction, action: RequestActions) => {
    try {
        
    } catch (err) {
    
    }
};

// TODO: create bapClientTriggerSettler()