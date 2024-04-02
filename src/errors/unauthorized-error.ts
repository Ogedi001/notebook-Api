import { StatusCodes } from "http-status-codes";
import { CustomError } from "./custom-error";

export class UnauthorizedError extends CustomError {
    statusCode = StatusCodes.UNAUTHORIZED;
    constructor(message: string) {
        super('Not Authorized')
        //Set every offspring prototype to this prototype
        Object.setPrototypeOf(this, UnauthorizedError.prototype)
    }
    serializeErrors() {
        return [{ message: this.message }]
    }


}