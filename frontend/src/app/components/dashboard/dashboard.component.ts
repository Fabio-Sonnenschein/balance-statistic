import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user";
import {AuthService} from "../../services/auth.service";
import {APIService} from "../../services/api.service";
import {Router} from "@angular/router";
import {CurrencyService} from "../../services/currency.service";
import {DashboardMenu} from "../../enums/dashboard-menu";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    name: string = this._authService.name;
    activeContent: string = DashboardMenu.DASHBOARD;

    constructor(private _authService: AuthService,
                private _api: APIService,
                private _currency: CurrencyService,
                private _router: Router) {

    }

    ngOnInit(): void {
        if (!this._authService.isLoggedIn()) this._router.navigateByUrl('/login');
    }

    changeContent(target: string) {
        switch (target) {
            case DashboardMenu.DASHBOARD:
                this.activeContent = DashboardMenu.DASHBOARD;
                break;
            case DashboardMenu.BALANCE:
                this.activeContent = DashboardMenu.BALANCE;
                break;
            case DashboardMenu.SAVING_GOALS:
                this.activeContent = DashboardMenu.SAVING_GOALS;
                break;
            case DashboardMenu.ACCOUNTS:
                this.activeContent = DashboardMenu.ACCOUNTS;
                break;
            case DashboardMenu.TRANSACTIONS:
                this.activeContent = DashboardMenu.TRANSACTIONS;
                break;
            case DashboardMenu.PREFERENCES:
                this.activeContent = DashboardMenu.PREFERENCES;
                break;
            default:
                this.activeContent = DashboardMenu.DASHBOARD;
                break;
        }
    }

    logout() {
        this._authService.logout();
        this._router.navigateByUrl('/login').then();
    }
}
