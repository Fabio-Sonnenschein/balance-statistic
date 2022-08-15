import {Injectable} from '@angular/core';
import {Currency} from "../enums/currency";

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
    currencyType: Currency;

    constructor() {
        this.currencyType = Currency.EUR;
    }

    public formatNumber(inputNumber: number, currencyType: Currency, fractionDigits: number = 2): string {
        return this.currencyFormatFactory(currencyType, fractionDigits).format(inputNumber);
    }

    currencyFormatFactory(currencyType: Currency, fractionDigits: number) {
        switch (currencyType) {
            case Currency.EUR:
                return new Intl.NumberFormat('de-DE', {
                    style: 'currency',
                    currency: Currency.EUR,
                    minimumFractionDigits: fractionDigits
                });
            case Currency.USD:
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: Currency.USD,
                    minimumFractionDigits: fractionDigits
                });
            case Currency.GBP:
                return new Intl.NumberFormat('en-GB', {
                    style: 'currency',
                    currency: Currency.GBP,
                    minimumFractionDigits: fractionDigits
                });
            case Currency.CAD:
                return new Intl.NumberFormat('en-CA', {
                    style: 'currency',
                    currency: Currency.CAD,
                    minimumFractionDigits: fractionDigits
                });
            case Currency.CHF:
                return new Intl.NumberFormat('de-CH', {
                    style: 'currency',
                    currency: Currency.CHF,
                    minimumFractionDigits: fractionDigits
                });
            default:
                return new Intl.NumberFormat('de-DE', {
                    style: 'currency',
                    currency: Currency.EUR,
                    minimumFractionDigits: fractionDigits
                });
        }
    }
}
