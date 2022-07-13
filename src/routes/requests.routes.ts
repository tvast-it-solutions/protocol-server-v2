import { Router } from "express";
import { RequestActions } from "../schemas/configs/actions.app.config.schema";
import { AppMode } from "../schemas/configs/app.config.schema";
import { getConfig } from "../utils/config.utils";
import logger from "../utils/logger.utils";

export const requestsRouter = Router();
const configuredRequestActions = getConfig().app.actions.requests;

const isConfigured: Map<RequestActions, boolean> = new Map<RequestActions, boolean>();

// BAP Configuration.
if (getConfig().app.mode === AppMode.bap) {
    // All triggers for BAP are defined using request actions.
}

// BPP Configuration.
if (getConfig().app.mode === AppMode.bpp) {
    // All requests for BPP are defined using request actions.
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
