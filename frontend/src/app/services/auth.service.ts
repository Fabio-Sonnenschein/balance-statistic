import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {AuthResponse} from "../models/auth-response";
import {environment} from "../../environments/environment";
import {APIPaths} from "../enums/api-paths";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    apiURL: string = environment.apiURL;

    constructor(private _httpClient: HttpClient) { }

    public get token(): string {
        return localStorage.getItem('token') || '';
    }

    public set token(token: string) {
        localStorage.setItem('token', token);
    }

    public get tokenExpiry(): Date {
        let expiresAt = localStorage.getItem('tokenExpiry');
        if (expiresAt) return new Date(expiresAt);
        return new Date(0);
    }

    public set tokenExpiry(date: Date) {
        localStorage.setItem('tokenExpiry', date.toISOString());
    }

    public get name(): string {
        return localStorage.getItem('name') || '';
    }

    public set name(name: string) {
        localStorage.setItem('name', name);
    }

    public isLoggedIn():boolean {
        if (!(new Date() < this.tokenExpiry)) {
            this.logout();
            return false;
        }
        return (Boolean(this.token) && (new Date() < this.tokenExpiry));
    }

    register(user: User) {
        return this._httpClient.post(
            this.apiURL + APIPaths.register,
            JSON.stringify(user));
    }

    login(email: string, password: string): Observable<AuthResponse> {
        return this._httpClient.post<AuthResponse>(
                this.apiURL + APIPaths.login,
                JSON.stringify({'email': email, 'password': password}))
            .pipe(tap((data: AuthResponse) => {
                this.token = data.token;
                this.tokenExpiry = new Date(data.expires);
                this.name = data.name;
            }));
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
        localStorage.removeItem('name');
    }
}
