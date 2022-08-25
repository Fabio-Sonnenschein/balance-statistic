import {Component, OnInit, ViewChild} from '@angular/core';
import {CurrencyService} from "../../services/currency.service";
import {Currency} from "../../enums/currency";
import {SelectionModel} from "@angular/cdk/collections";
import {Account} from "../../models/account";
import {MatTableDataSource} from "@angular/material/table";
import {AccountType} from "../../enums/account-type";
import {MatSort} from "@angular/material/sort";

const ELEMENT_DATA: Account[] = [
    {name: 'Checking Account', number: 'DEXXXXXXX00', balance: -200, currency: Currency.EUR, provider: 'Bababooey Inc.', type: AccountType.CHECKING_ACCOUNT, selected: true},
    {name: 'Savings Account', number: 'DEXXXXXXX01', balance: 0, currency: Currency.EUR, provider: 'Bababooey Inc.', type: AccountType.SAVINGS_ACCOUNT, selected: true}
]

@Component({
  selector: 'app-dashboard-content',
  templateUrl: './dashboard-content.component.html',
  styleUrls: ['./dashboard-content.component.scss']
})
export class DashboardContentComponent implements OnInit {
    name: string = 'Bababooey';
    currency = Currency.EUR;
    selection = new SelectionModel<Account>(true, []);
    dataSource = new MatTableDataSource<Account>(ELEMENT_DATA);
    displayedColumns: string[] = ['select', 'type', 'name', 'number', 'provider', 'balance'];
    accountTotal: number = 0;

    constructor(public _currencyService: CurrencyService) { }

    ngOnInit(): void {
    }

    @ViewChild(MatSort) sort!: MatSort;

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
        for (let account of this.dataSource.data) {
            if (account.selected) {
                this.selection.select(account);
                this.accountTotal += account.balance;
            }
        }
    }

    isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    toggleAllRows(): void {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }

        this.selection.select(...this.dataSource.data);
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
