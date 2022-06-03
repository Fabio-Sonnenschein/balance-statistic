import {APIError} from "../enums/api-error";

export interface CustomError {
    status: number,
    message: APIError
}
