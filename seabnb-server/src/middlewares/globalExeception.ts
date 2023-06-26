import { ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";

interface ExceptionPayload {
    validationErrors?: ValidationError[]
    message?: string,
    statusCode: number
}

export class Exception extends Error {
    statusCode: number
    validationErrors?: ValidationError[]

    constructor(payload: ExceptionPayload) {
        super(payload.message);
        this.statusCode = payload.statusCode;
        this.validationErrors = payload.validationErrors;
    }
}

export function GlobalException(err: Exception, req: Request, res: Response, next: NextFunction) {
    if (err instanceof Exception) {
        if (!err.statusCode) {
            return res.status(500).json({ message: 'Internal server error', statusCode: 500 })
        }

        if (err.validationErrors) {
            const errors = err.validationErrors.map((e) => {
                if (!e.constraints) 
                    return { property: e.property, errors: [] };

                return { property: e.property, errors: Object.entries(e.constraints).map(([key, value]) => value) }
            })
            return res.status(err.statusCode).json({ message: errors, statusCode: err.statusCode })
        }

        // Handle the custom exception by returning a JSON response with the error message and status code
        return res.status(err.statusCode).json({ message: err.message, statusCode: err.statusCode });
    } else {
        // Pass the error to the next error handling middleware
        return next(err);
    }
}