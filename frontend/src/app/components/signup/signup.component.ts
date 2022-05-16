import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {APIService} from "../../services/api.service";
import {Router} from "@angular/router";
import {User} from "../../models/user";
import {HttpErrorResponse} from "@angular/common/http";
import {catchError, throwError} from "rxjs";
import {AuthResponse} from "../../models/auth-response";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
    name: string;
    email: string = '';
    password: string = '';
    error: string = '';
    passwordHidden: boolean = true;
    loggedIn: boolean;
    user: User = new User();

    constructor(private _authService: AuthService,
                private _api: APIService,
                private _router: Router) {
        this.loggedIn = this._authService.isLoggedIn();
        this.name = this._authService.name;
    }

    ngOnInit(): void {
    }

    signup() {
        this.error = '';
        this._authService.logout();
        this._authService.signup(this.user).pipe(catchError(this.errorHandler))
            .subscribe((authResponse: AuthResponse) => {
                this.redirectToSetup();
            }, (error: string) => {
                console.error(error);
                this.error = error;
            });
    }

    logout() {
        this._authService.logout();
        this.loggedIn = false;
    }

    redirectToLogin() {
        this._router.navigateByUrl('/login');
    }

    redirectToSetup() {
        this._router.navigateByUrl('/setup');
    }

    redirectToDashboard() {
        this._router.navigateByUrl('/dashboard');
    }

    errorHandler(error: HttpErrorResponse) {
        return throwError(() => 'Internal server error');
    }
}
