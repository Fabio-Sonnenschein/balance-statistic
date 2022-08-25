import {AccountType} from "../enums/account-type";
import {Currency} from "../enums/currency";

export class Account {
    name: string = '';
    number: string = '';
    balance: number = 0;
    currency: Currency = Currency.EUR;
    provider: string = '';
    type: AccountType = AccountType.CHECKING_ACCOUNT;
    selected: boolean = true;
}
