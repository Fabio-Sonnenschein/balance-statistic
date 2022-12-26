import {AuthService} from './auth.service';
import {UserService} from './user.service';
import {AccountService} from './account.service';
import {BudgetService} from './budget.service';
import {SavingGoalService} from './savingGoal.service';
import {TransactionService} from './transaction.service';
import {RecurrenceService} from "./recurrence.service";

export default {
    // Centralized Service export
    accountService: new AccountService(),
    authService: new AuthService(),
    budgetService: new BudgetService(),
    userService: new UserService(),
    savingGoalService: new SavingGoalService(),
    transactionService: new TransactionService(),
    recurrenceService: new RecurrenceService()
}
