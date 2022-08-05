import { NextFunction, Request, Response } from 'express'
import * as OpenApiValidator from 'express-openapi-validator'
import { Exception, ExceptionType } from '../models/exception.model'

const openApiValidator = OpenApiValidator.middleware({
    apiSpec: "schemas/core.yaml",
    validateRequests: true,
    validateResponses: false,
    $refParser: {
        mode: 'dereference'
    }
})

const schemaErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err.data)
    const errorData = {
        code: err.status,
        message: "OpenApiValidator Error",
        data: err,
        type: ExceptionType.OpenApiSchema_ParsingError
    } as Exception;
    next(errorData);
}

const openApiValidatorMiddleware=[
    ...openApiValidator,
    schemaErrorHandler
];
export default openApiValidatorMiddleware;
