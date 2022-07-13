import { z } from "zod";

export enum RequestActions {
    search = "search",
    select = "select",
    init = "init",
    confirm = "confirm",
    update = "update",
    status = "status",
    track = "track",
    cancel = "cancel",
    rating = "rating",
    support = "support",
}

export enum ResponseActions {
    on_search = "on_search",
    on_select = "on_select",
    on_init = "on_init",
    on_confirm = "on_confirm",
    on_update = "on_update",
    on_status = "on_status",
    on_track = "on_track",
    on_cancel = "on_cancel",
    on_rating = "on_rating",
    on_support = "on_support",
}

export enum RequestType {
    broadcast = 'broadcast',
    direct = 'direct',
}

export const actionsAppConfigSchema = z.object({
    requests: z.array(z.nativeEnum(RequestActions)),
    responses: z.array(z.nativeEnum(ResponseActions)),
});

export type ActionsAppConfigDataType = z.infer<typeof actionsAppConfigSchema>;

export const parseActionsAppConfig = (config: any): any => {
    const actionsAppConfig = actionsAppConfigSchema.parse(config);
    return actionsAppConfig;
}
