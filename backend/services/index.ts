import { AuthService } from './auth.service';
import {UserService} from "./user.service";
import {AccountService} from "./account.service";
import {BudgetService} from "./budget.service";


export default {
    // Centralized Service export
    accountService: new AccountService(),
    authService: new AuthService(),
    budgetService: new BudgetService(),
    userService: new UserService()
}
