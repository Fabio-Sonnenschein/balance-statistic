import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {AuthResponse} from "../../models/auth-response";
import {APIService} from "../../services/api.service";
import {Router} from "@angular/router";
import {User} from "../../models/user";
import {HttpErrorResponse} from "@angular/common/http";
import {CustomError} from "../../models/custom-error";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    name: string;
    error: string = '';
    passwordHidden: boolean = true;
    loggedIn: boolean;
    loading: boolean = false;
    user: User = new User();

    constructor(private _authService: AuthService,
                private _api: APIService,
                private _router: Router) {
        this.loggedIn = this._authService.isLoggedIn();
        this.name = this._authService.name;
    }

    ngOnInit(): void {
    }

    login() {
        this.loading = true;
        this.error = '';
        this._authService.logout();
        this._authService.login(this.user.email, this.user.password)
            .subscribe({
                next: (authResponse: AuthResponse) => {
                    this.redirectToDashboard();
                },
                error: (error: HttpErrorResponse) => {
                    this._api.errorHandler(error).subscribe({
                        next: (handledError: CustomError) => {
                            this.error = handledError.message;
                            this.loading = false;
                        }
                    });
                }
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
}
