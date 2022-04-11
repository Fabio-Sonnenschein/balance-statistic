import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class APIService {
    apiURL: string = environment.apiURL;

    constructor(private _httpClient: HttpClient, private _authService: AuthService) { }

    errorHandler(error: HttpErrorResponse) {
        return throwError(() => (error.message || 'Internal server error'));
    }
}
