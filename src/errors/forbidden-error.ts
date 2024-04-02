import { StatusCodes } from "http-status-codes";
import { CustomError } from "./custom-error";

export class ForbiddenError extends CustomError {
    statusCode = StatusCodes.FORBIDDEN;
    constructor() {
        super('Forbidden')
        //Set every offspring prototype to this prototype
        Object.setPrototypeOf(this, ForbiddenError.prototype)
    }
    serializeErrors() {
        return [{ message: this.message }]
    }
}