export enum ExceptionType {
    Cache_NotIntialized = "Cache_NotIntialized",
    
    Config_NotFound = "Config_NotFound",
    Config_ClientConfigurationInvalid = "Config_ClientConfigurationInvalid",
    Config_ResponseCacheConfigurationInvalid = "Config_ResponseCacheConfigurationInvalid",
    Config_BPPConfigurationInvalid = "Config_BPPConfigurationInvalid",
    Config_BAPConfigurationInvalid = "Config_BAPConfigurationInvalid",

    Authentication_HeaderParsingFailed = "Authentication_HeaderParsingFailed",

    Context_NotFound = "Context_NotFound",
    Context_DomainNotFound = "Context_DomainNotFound",

    Registry_LookupError = "Registry_LookupError",
    Registry_NoSubscriberFound = "Registry_NoSubscriberFound",

    Mongo_URLNotFound = "Mongo_URLNotFound",
    Mongo_ConnectionFailed = "Mongo_ConnectionFailed",
    Mongo_ClientNotInitialized = "Mongo_ClientNotInitialized",

    ResponseCache_NotEnabled = "ResponseCache_NotEnabled",
    ResponseCache_NotInitialized="ResponseCache_NotInitialized",
}

export class Exception {
    message: string;
    code: number;
    type: ExceptionType;
    errorData?: any;
    constructor(type: ExceptionType, message: string, code: number, errorData?: any) {
        this.message = message;
        this.code = code;
        this.type=type;
        this.errorData=errorData;
    }
}