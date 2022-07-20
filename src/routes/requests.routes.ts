import { Router } from "express";
import { RequestActions } from "../schemas/configs/actions.app.config.schema";
import { AppMode } from "../schemas/configs/app.config.schema";
import { GatewayMode } from "../schemas/configs/gateway.app.config.schema";
import { getConfig } from "../utils/config.utils";
import logger from "../utils/logger.utils";
import { jsonCompressorMiddleware } from "../middlewares/jsonParser.middleware"
import { authValidatorMiddleware } from "../middlewares/auth.middleware"
import { contextMiddleware } from "../middlewares/context.middleware"
import validator from "../middlewares/validator.middleware"
import { bapTriggerHandler } from "../controllers/bap.trigger.controller"

export const requestsRouter = Router();
const configuredRequestActions = getConfig().app.actions.requests;

const isConfigured: Map<RequestActions, boolean> = new Map<RequestActions, boolean>();

let becknRoutes : String[] = [
    "search",
    "select",
    "init",
    "confirm",
    "status",
    "track",
    "cancel",
    "update",
    "rating",
    "support"
]

// BAP Configuration.
if (getConfig().app.mode === AppMode.bap) {
    // All triggers for BAP are defined using request actions.
    if(getConfig().app.gateway.mode === GatewayMode.network) {
        // Client Mode
        becknRoutes.forEach(route => {                                      // TODO
            requestsRouter.post(`/on_${route}`, jsonCompressorMiddleware, authValidatorMiddleware, validator, bapTriggerHandler)
        })
    }
}

// BPP Configuration.
if (getConfig().app.mode === AppMode.bpp) {
    // All requests for BPP are defined using request actions.
    if(getConfig().app.gateway.mode === GatewayMode.network) {
        Object.keys(RequestActions).forEach(action => {
            requestsRouter.post(`/${action}`, jsonCompressorMiddleware, validator)
        })
    }
}

// Unconfigured request actions.
Object.keys(RequestActions).forEach(action => {
    if (!isConfigured.has(action as RequestActions)) {
        isConfigured.set(action as RequestActions, false);
    }

    if (!isConfigured.get(action as RequestActions)) {
        // TODO: Add unconfigured request action handling.
    }
});
