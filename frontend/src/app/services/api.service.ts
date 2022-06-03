import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {Observable, of, tap} from "rxjs";
import {APIError} from "../enums/api-error";
import {Account} from "../models/account";
import {APIPaths} from "../enums/api-paths";
import {Card} from "../models/card";
import {Portfolio} from "../models/portfolio";
import {Budget} from "../models/budget";
import {CustomError} from "../models/custom-error";

@Injectable({
  providedIn: 'root'
})
export class APIService {
    apiURL: string = environment.apiURL;

    constructor(private _httpClient: HttpClient, private _authService: AuthService) { }

    addAccount(account: Account) {
        return this._httpClient.post<any>(
            this.apiURL + APIPaths.ACCOUNT,
            {
                token: this._authService.token,
                account: account
            }
        );
    }

    updateAccount(previousAccountNumber: string, account: Account) {
        return this._httpClient.put(
            this.apiURL + APIPaths.ACCOUNT,
            {
                token: this._authService.token,
                previousNumber: previousAccountNumber,
                account: account
            }
        ).pipe(tap((data: any) => {
        }));
    }

    removeAccount(account: Account) {
        return this._httpClient.delete(
            this.apiURL + APIPaths.ACCOUNT,
            {
                body: {
                    token: this._authService.token,
                    account: account
                }
            }
        ).pipe(tap((data: any) => {
        }));
    }

    addCard(card: Card) {
        return this._httpClient.post(
            this.apiURL + APIPaths.CARD,
            {
                token: this._authService.token,
                card: card
            }
        ).pipe(tap((data: any) => {
        }));
    }

    addPortfolio(portfolio: Portfolio) {
        return this._httpClient.post(
            this.apiURL + APIPaths.PORTFOLIO,
            {
                token: this._authService.token,
                portfolio: portfolio
            }
        ).pipe(tap((data: any) => {
        }));
    }

    updateBudget(budget: Budget) {
        return this._httpClient.put(
            this.apiURL + APIPaths.BUDGET,
            {
                token: this._authService.token,
                budget: budget
            }
        );
    }

    errorHandler(error: HttpErrorResponse): Observable<CustomError> {
        switch (error.url?.split('/')[3]) {
            case 'login':
                switch (error.status) {
                    case 401:
                        return of({
                            status: 401,
                            message: APIError.INVALID_CREDENTIALS
                        });
                    default:
                        return of({
                            status: error.status,
                            message: APIError.PROBLEM
                        });
                }
            case 'signup':
                switch (error.status) {
                    case 409:
                        return of({
                            status: 409,
                            message: APIError.EMAIL_ALREADY_IN_USE
                        });
                    default:
                        return of({
                            status: error.status,
                            message: APIError.PROBLEM
                        });
                }
            case 'account':
                switch (error.status) {
                    case 409:
                        return of({
                            status: 409,
                            message: APIError.ACCOUNT_NUMBER_ALREADY_IN_USE
                        });
                    default:
                        return of({
                            status: error.status,
                            message: APIError.PROBLEM
                        });
                }
            case 'budget':
                switch (error.status) {
                    default:
                        return of({
                            status: error.status,
                            message: APIError.PROBLEM
                        });
                }
            default:
                switch (error.status) {
                    case 400:
                        return of({
                            status: 400,
                            message: APIError.BAD_REQUEST
                        });
                    case 401:
                        return of({
                            status: 401,
                            message: APIError.UNAUTHORIZED
                        });
                    case 403:
                        return of({
                            status: 403,
                            message: APIError.FORBIDDEN
                        });
                    case 404:
                        return of({
                            status: 404,
                            message: APIError.NOT_FOUND
                        });
                    case 409:
                        return of({
                            status: 409,
                            message: APIError.CONFLICT
                        });
                    case 500:
                        return of({
                            status: 500,
                            message: APIError.INTERNAL_SERVER_ERROR
                        });
                    case 501:
                        return of({
                            status: 501,
                            message: APIError.NOT_IMPLEMENTED
                        });
                    default:
                        return of({
                            status: error.status,
                            message: APIError.INTERNAL_SERVER_ERROR
                        });
                }
        }
    }
}
