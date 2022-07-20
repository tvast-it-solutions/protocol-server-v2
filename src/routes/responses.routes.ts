import { NextFunction, Request, Response, Router } from "express";
import { bapNetworkResponseHandler } from "../controllers/bap.response.controller";
import { bapClientTriggerHandler } from "../controllers/bap.trigger.controller";
import { bppClientResponseHandler } from "../controllers/bpp.response.controller";
import { authValidatorMiddleware } from "../middlewares/auth.middleware";
import { contextBuilderMiddleware } from "../middlewares/context.middleware";
import { jsonCompressorMiddleware } from "../middlewares/jsonParser.middleware";
import openApiValidatorMiddleware from "../middlewares/validator.middleware";
import { ResponseActions } from "../schemas/configs/actions.app.config.schema";
import { AppMode } from "../schemas/configs/app.config.schema";
import { GatewayMode } from "../schemas/configs/gateway.app.config.schema";
import { getConfig } from "../utils/config.utils";

export const responsesRouter = Router();

// BAP Network-Side Gateway Configuration.
if ((getConfig().app.mode === AppMode.bap) && (getConfig().app.gateway.mode === GatewayMode.network)) {
    const responseActions = getConfig().app.actions.responses;
    Object.keys(ResponseActions).forEach(action => {
        if (responseActions[action as ResponseActions]) {
            responsesRouter.post(`/${action}`, jsonCompressorMiddleware, 
            authValidatorMiddleware, openApiValidatorMiddleware, 
            async (req: Request, res: Response, next: NextFunction) => {
                await bapNetworkResponseHandler(req, res, next, action as ResponseActions);
            });
        } else {
            // TODO: Add to unconfigured.
        }
    });
}

// BPP Client-Side Gateway Configuration.
if ((getConfig().app.mode === AppMode.bpp) && (getConfig().app.gateway.mode === GatewayMode.network)) {
    const responseActions = getConfig().app.actions.responses;
    Object.keys(ResponseActions).forEach(action => {
        if (responseActions[action as ResponseActions]) {
            responsesRouter.post(`/${action}`, jsonCompressorMiddleware, 
            async (req: Request, res: Response, next: NextFunction) =>{
                await contextBuilderMiddleware(req, res, next, action);
            }, openApiValidatorMiddleware, 
            async (req: Request, res: Response, next: NextFunction) => {
                await bppClientResponseHandler(req, res, next, action as ResponseActions);
            });
        } else {
            // TODO: Add to unconfigured.
        }
    });
}