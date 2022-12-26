import {Component, OnInit, ViewChild} from '@angular/core';
import {CurrencyService} from "../../services/currency.service";
import {Currency} from "../../enums/currency";
import {SelectionModel} from "@angular/cdk/collections";
import {Account} from "../../models/account";
import {MatTableDataSource} from "@angular/material/table";
import {AccountType} from "../../enums/account-type";
import {MatSort} from "@angular/material/sort";
import {APIService} from "../../services/api.service";
import {AuthService} from "../../services/auth.service";
import {HttpErrorResponse} from "@angular/common/http";
import {CustomError} from "../../models/custom-error";
import {Budget} from "../../models/budget";
import {SavingGoal} from "../../models/saving-goal";

@Component({
  selector: 'app-dashboard-content',
  templateUrl: './dashboard-content.component.html',
  styleUrls: ['./dashboard-content.component.scss']
})
export class DashboardContentComponent implements OnInit {
    name: string;
    currency = Currency.EUR;
    selection = new SelectionModel<Account>(true, []);
    budget: Budget = new Budget();
    accountSource = new MatTableDataSource<Account>();
    displayedAccountColumns: string[] = ['select', 'type', 'name', 'number', 'provider', 'balance'];
    accountTotal: number = 0;
    savingGoals: SavingGoal[] = [];
    transactionSource = new MatTableDataSource();
    displayedTransactionColumns: string[] = [];

    constructor(public _currencyService: CurrencyService,
                private _api: APIService,
                private _authService: AuthService) {
        this.name = this._authService.name;
    }

    ngOnInit(): void {
        this.getBudget();
        this.getAccounts();
        this.getSavingGoals();
    }

    @ViewChild(MatSort) sort!: MatSort;

    ngAfterViewInit() {
        this.accountSource.sort = this.sort;
        for (let account of this.accountSource.data) {
            if (account.sumSelect) {
                this.selection.select(account);
                this.accountTotal += account.balance;
            }
        }
    }

    isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = this.accountSource.data.length;
        return numSelected === numRows;
    }

    toggleAllRows(): void {
        if (this.isAllSelected()) {
            this.selection.clear();

            this.accountTotal = 0;
            for (let account of this.selection.selected) {
                this.accountTotal += account.balance;
            }
            return;
        }

        this.selection.select(...this.accountSource.data);

        this.accountTotal = 0;
        for (let account of this.selection.selected) {
            this.accountTotal += account.balance;
        }
    }

    getBudget() {
        this._api.getBudget()
            .subscribe({
                next: (budget: Budget) => {
                    this.budget = budget;
                },
                error: (error: HttpErrorResponse) => {
                    this._api.errorHandler(error).subscribe({
                        next: (handledError: CustomError) => {
                            console.error(handledError);
                        }
                    })
                }
            });
    }

    getAccounts() {
        this._api.getAccountsByUser()
            .subscribe({
                next: (accounts: Account[]) => {
                    this.accountSource.data = accounts;
                    for (let account of this.accountSource.data) {
                        if (account.sumSelect) {
                            this.selection.select(account);
                            this.accountTotal += account.balance;
                        }
                    }
                },
                error: (error: HttpErrorResponse) => {
                    this._api.errorHandler(error).subscribe({
                        next: (handledError: CustomError) => {
                            console.error(handledError);
                        }
                    });
                }
            });
    }

    getSavingGoals() {
        this._api.getSavingGoals()
            .subscribe({
                next: (savingGoals: SavingGoal[]) => {
                    this.savingGoals = savingGoals;
                }
            });
    }

    updateAccountTotal(row: Account) {
        this.selection.toggle(row);

        this.accountTotal = 0;
        for (let account of this.selection.selected) {
            this.accountTotal += account.balance;
        }
    }

    typeIcon(type: AccountType): string {
        switch (type) {
            case AccountType.SAVINGS_ACCOUNT:
                return "savings";
            case AccountType.CHECKING_ACCOUNT:
                return "account_balance_wallet";
            case AccountType.CREDIT_CARD:
                return "credit_card";
            case AccountType.PREPAID_CARD:
                return "credit_card";
            case AccountType.PORTFOLIO:
                return "monitoring";
            default:
                return "account_balance";
        }
    }
}
