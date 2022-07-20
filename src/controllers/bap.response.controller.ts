import { NextFunction, Request, Response } from "express"
import { Locals } from "../interfaces/locals.interface"
import { ResponseActions } from "../schemas/configs/actions.app.config.schema"

export const bapNetworkResponseHandler = async (req: Request, res: Response<{}, Locals>, next: NextFunction, action: ResponseActions) => {
    try {

    } catch (err) {

    }
}

// TODO: create bapNetworkResponseSettler()