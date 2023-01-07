import {AuthService} from './auth.service';
import {UserService} from './user.service';
import {AccountService} from './account.service';
import {BudgetService} from './budget.service';
import {SavingGoalService} from './savingGoal.service';
import {TransactionService} from './transaction.service';
import {RecurrenceService} from './recurrence.service';

export default {
  // Centralized Service export
  accountService: new AccountService(),
  authService: new AuthService(),
  budgetService: new BudgetService(),
  recurrenceService: new RecurrenceService(),
  savingGoalService: new SavingGoalService(),
  transactionService: new TransactionService(),
  userService: new UserService()
};
