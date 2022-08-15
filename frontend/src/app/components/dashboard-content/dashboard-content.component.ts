import { Component, OnInit } from '@angular/core';
import {CurrencyService} from "../../services/currency.service";
import {Currency} from "../../enums/currency";

@Component({
  selector: 'app-dashboard-content',
  templateUrl: './dashboard-content.component.html',
  styleUrls: ['./dashboard-content.component.scss']
})
export class DashboardContentComponent implements OnInit {
    name: string = 'bababooey';
    currency = Currency.EUR;

    constructor(public _currencyService: CurrencyService) { }

    ngOnInit(): void {
    }

}
