// TODO: Code bppRequestHandler()

import { NextFunction, Request, Response } from "express";
import { RequestActions } from "../schemas/configs/actions.app.config.schema";

export const bppRequestHandler = async (req: Request, res: Response, next: NextFunction, action: RequestActions) => {};