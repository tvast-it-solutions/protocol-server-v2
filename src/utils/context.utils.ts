import moment from 'moment';
import { v4 as uuid_v4 } from 'uuid';
import { Exception, ExceptionType } from '../models/exception.model';
import { AppMode } from '../schemas/configs/app.config.schema';
import { getConfig } from './config.utils';

export function buildContext(context: any, action: string) {
    const timestamp = new Date().toISOString();
    let message_id = uuid_v4();
    let transaction_id = uuid_v4();
    if(getConfig().app.mode==AppMode.bpp){
        if(!context.message_id){
            throw new Exception(ExceptionType.OpenApiSchema_ParsingError, "Message id is missing in BPP Mode.", 400, [
                {
                    error: "body.context.message_id is missing",
                    path: "body.context.message_id"
                }
            ]);
        }
        message_id=context.message_id as string;

        if(!context.transaction_id){
            throw new Exception(ExceptionType.OpenApiSchema_ParsingError, "Transaction id is missing in BPP Mode.", 400, [
                {
                    error: "body.context.transaction_id is missing",
                    path: "body.context.transaction_id"
                }
            ]);
        }

        transaction_id=context.transaction_id as string;
    }

    if (!context) {
        throw new Exception(ExceptionType.Context_NotFound, "Context not found", 404);
    }

    if (!context.domain) {
        throw new Exception(ExceptionType.Context_DomainNotFound, "Domain not found in the context", 404);
    }

    const ttl=moment.duration(getConfig().cache.ttl, 'ms').toISOString();
    const bapContext = {
        domain: context.domain,
        country: (context.country) ? context.country : getConfig().app.country,
        city: (context.city) ? context.city : getConfig().app.city,
        core_version: context.core_version,
        useCache: (context.useCache==true),

        ...context,
        
        transaction_id: transaction_id,
        message_id: message_id,
        ttl: ttl,
        timestamp: timestamp,
        bap_id: getConfig().app.subscriberId,
        bap_uri: getConfig().app.subscriberUri,
        action: action,
    }

    return bapContext;
}