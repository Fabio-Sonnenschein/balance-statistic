import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {AuthResponse} from "../../models/auth-response";
import {catchError, throwError} from "rxjs";
import {APIService} from "../../services/api.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    name: string;
    email: string = '';
    password: string = '';
    error: string = '';
    passwordHidden: boolean = true;
    loggedIn: boolean;

    constructor(private _authService: AuthService,
                private _api: APIService,
                private _router: Router) {
        this.loggedIn = this._authService.isLoggedIn();
        this.name = this._authService.name;
    }

    ngOnInit(): void {
    }

    login() {
        this.error = '';
        this._authService.logout();
        this._authService.login(this.email, this.password).pipe(catchError(this.errorHandler))
            .subscribe((authResponse: AuthResponse) => {
                this.redirectToDashboard();
            }, (error: string) => {
                this.error = error;
            });
    }

    logout() {
        this._authService.logout();
        this.loggedIn = false;
    }

    redirectToSignUp() {
        this._router.navigateByUrl('/signup');
    }

    redirectToDashboard() {
        this._router.navigateByUrl('/dashboard');
    }

    errorHandler(error: HttpErrorResponse) {
        return throwError(() => 'Internal server error');
    }
}
