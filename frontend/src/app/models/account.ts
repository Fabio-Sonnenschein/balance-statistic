import {AccountType} from "../enums/account-type";
import {Currency} from "../enums/currency";

export class Account {
    access: AccessPolicy = {
        owner: '',
        subscribers: []
    };
    name: string = '';
    number: string = '';
    balance: number = 0;
    currency: Currency = Currency.EUR;
    provider: string = '';
    type: AccountType = AccountType.CHECKING_ACCOUNT;
    sumSelect?: boolean = true;
}

class AccessPolicy {
    owner: string = '';
    subscribers: string[] = [];
}
