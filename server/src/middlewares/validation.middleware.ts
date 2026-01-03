import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain } from "express-validator";

// Generic function to catch validation errors
export const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Run all validators
        await Promise.all(validations.map(validation => validation.run(req)));

        // check for errors
        const errors = validationResult(req);
        if(errors.isEmpty()){
            return next();
        }

        // return 400 Bad Request with details
        res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array().map(err => ({
                field: err.type === 'field' ? err.path : err.type,
                message: err.msg
            }))
        });
    };
};