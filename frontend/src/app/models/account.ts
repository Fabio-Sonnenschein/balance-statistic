import {AccountType} from "../enums/account-type";

export class Account {
    name: string = '';
    number: string = '';
    balance: number = 0;
    provider: string = '';
    type: AccountType = AccountType.CHECKING_ACCOUNT;
}
