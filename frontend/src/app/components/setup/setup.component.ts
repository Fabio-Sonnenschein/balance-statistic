import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Account} from "../../models/account";
import {Budget} from "../../models/budget";
import {AccountType} from "../../enums/account-type";
import {DEAccountProvider} from "../../enums/de.account-provider";
import {APIService} from "../../services/api.service";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {CustomError} from "../../models/custom-error";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {
    accountGroup: FormGroup;
    budgetGroup: FormGroup;
    account: Account = new Account();
    budget: Budget = new Budget();
    error: string = '';
    loading: boolean = false;

    constructor(private _api: APIService,
                private _authService: AuthService,
                private _formBuilder: FormBuilder,
                private _router: Router) {
        this.accountGroup = this._formBuilder.group({
            name: ['', Validators.required],
            number: ['', [Validators.maxLength(34)]],
            provider: [],
            balance: ['', Validators.required]
        });
        this.budgetGroup = this._formBuilder.group({
            budget: ['', Validators.required],
            savingRate: ['', Validators.required],
            earnings: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        if (!this._authService.isLoggedIn()) this._router.navigateByUrl('/login');
    }

    checkAccountNumber() {
        this.accountGroup.controls['number'].setValue(this.accountGroup.get('number')?.value.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim());
        switch (this.accountGroup.get('number')?.value.slice(0, 2)) {
            case 'DE':
                switch (this.accountGroup.get('number')?.value.slice(8, 9)) {
                    case '0':
                        this.accountGroup.controls['provider'].setValue(DEAccountProvider.BUNDESBANK);
                        break;
                    case '1':
                        this.accountGroup.controls['provider'].setValue(DEAccountProvider.POSTBANK);
                        break;
                    case '4':
                        this.accountGroup.controls['provider'].setValue(DEAccountProvider.COMMERZBANK);
                        break;
                    case '5':
                        this.accountGroup.controls['provider'].setValue(DEAccountProvider.SPARKASSE);
                        break;
                    case '7':
                        this.accountGroup.controls['provider'].setValue(DEAccountProvider.DEUTSCHE_BANK);
                        break;
                    case '8':
                        this.accountGroup.controls['provider'].setValue(DEAccountProvider.COMMERZBANK);
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
    }

    completeSetup() {
        this.loading = true;
        this.account.type = AccountType.CHECKING_ACCOUNT;
        this.account.name = this.accountGroup.get('name')?.value;
        this.account.number = this.accountGroup.get('number')?.value;
        this.account.provider = this.accountGroup.get('provider')?.value;
        this.account.balance = this.accountGroup.get('balance')?.value;

        this.budget.budget = this.budgetGroup.get('budget')?.value;
        this.budget.savingRate = this.budgetGroup.get('savingRate')?.value;
        this.budget.earnings = this.budgetGroup.get('earnings')?.value;

        let updateAccount: Promise<boolean> = new Promise((resolve, reject) => {
            this._api.addAccount(this.account)
                .subscribe({
                    next: (response: any) => {
                        console.log(response);
                        resolve(true);
                    },
                    error: (error: HttpErrorResponse) => {
                        this._api.errorHandler(error).subscribe({
                            next: (handledError: CustomError) => {
                                this.error = handledError.message;
                                reject(handledError);
                            }
                        });
                    }
                });
        });


        let updateBudget: Promise<boolean> = new Promise((resolve, reject) => {
            this._api.updateBudget(this.budget)
                .subscribe({
                    next: (response: any) => {
                        console.log(response);
                        resolve(true);
                    },
                    error: (error: HttpErrorResponse) => {
                        this._api.errorHandler(error).subscribe({
                            next: (handledError: CustomError) => {
                                this.error = handledError.message;
                                reject(handledError);
                            }
                        });
                    }
                });
        });

        Promise.all([updateAccount, updateBudget]).then((values) => {
            this._router.navigateByUrl('/dashboard');
        }).catch((reason) => {
            this.error = reason.message;
            this.loading = false;
        });
    }
}
