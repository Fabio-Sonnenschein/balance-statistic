import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {throwError} from "rxjs";
import {APIErrors} from "../enums/api-errors";

@Injectable({
  providedIn: 'root'
})
export class APIService {
    apiURL: string = environment.apiURL;

    constructor(private _httpClient: HttpClient, private _authService: AuthService) { }

    errorHandler(error: HttpErrorResponse) {
        return throwError(() => {
            switch (error.url?.split('/')[3]) {
                case 'login':
                    switch (error.status) {
                        case 401:
                            return APIErrors.INVALID_CREDENTIALS;
                        default:
                            return APIErrors.INTERNAL_SERVER_ERROR;
                    }
                case 'signup':
                    switch (error.status) {
                    case 409:
                        return APIErrors.EMAIL_ALREADY_IN_USE;
                    default:
                        return APIErrors.INTERNAL_SERVER_ERROR;
                    }
                default:
                    switch (error.status) {
                        case 400:
                            return APIErrors.BAD_REQUEST;
                        case 401:
                            return APIErrors.UNAUTHORIZED;
                        case 403:
                            return APIErrors.FORBIDDEN;
                        case 404:
                            return APIErrors.NOT_FOUND;
                        case 409:
                            return APIErrors.CONFLICT;
                        case 500:
                            return APIErrors.INTERNAL_SERVER_ERROR;
                        case 501:
                            return APIErrors.NOT_IMPLEMENTED;
                        default:
                            return APIErrors.INTERNAL_SERVER_ERROR;
                    }
            }
        });
    }
}
