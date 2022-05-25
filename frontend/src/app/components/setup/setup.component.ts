import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {Account} from "../../models/account";
import {BudgetPlan} from "../../models/budget-plan";

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {
    bankAccountFormGroup?: any;
    budgetFormGroup?: any;
    account: Account = new Account();
    budgetPlan: BudgetPlan = new BudgetPlan();

    constructor(private _formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.bankAccountFormGroup = this._formBuilder.group({
            accountName: ['', Validators.required],
            accountNumber: ['', [Validators.required, Validators.maxLength(34)]]
        });
        this.budgetFormGroup = this._formBuilder.group({
            budget: [''],
            savings: [''],
            expenses: ['']
        });

    }

    maskNumber() {
        this.account.number = this.account.number.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
    }
}
