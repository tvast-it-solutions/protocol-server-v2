import { Router } from "express";
import { ResponseActions } from "../schemas/configs/actions.app.config.schema";
import { AppMode } from "../schemas/configs/app.config.schema";
import { getConfig } from "../utils/config.utils";

export const responsesRouter = Router();
const configuredResponseActions = getConfig().app.actions.responses;

const isConfigured: Map<ResponseActions, boolean> = new Map<ResponseActions, boolean>();

// BAP Configuration.
if (getConfig().app.mode === AppMode.bap) {
    // All response callbacks are defined using response actions.
    configuredResponseActions.forEach(action => {
        isConfigured.set(action, true);
        
        // TODO: route bapResponseHandler.
    });
}

// BPP Configuration.
if (getConfig().app.mode === AppMode.bpp) {
    // All response apis are defined using response actions.
    configuredResponseActions.forEach(action => {
        isConfigured.set(action, true);

        // TODO: route bppResponseHandler.
    });
}

// Unconfigured response actions.
Object.keys(ResponseActions).forEach(action => {
    if (!isConfigured.has(action as ResponseActions)) {
        isConfigured.set(action as ResponseActions, false);
    }

    if (!isConfigured.get(action as ResponseActions)) {
        // TODO: Add unconfigured response action handling.
    }
});