class ExpensesController {
  constructor(view, budgetModel, expensesModel) {
    this.view = view;
    this.expensesModel = expensesModel;
    this.budgetModel = budgetModel;

    this.addEventListeners();
  }

  addEventListeners() {
    this.view.btnAddExpense.addEventListener(
      "click",
      this.addExpense.bind(this)
    );
    this.view.expensesListWrapper.addEventListener(
      "click",
      this.deleteExpense.bind(this)
    );
  }

  addExpense() {
    if (this.budgetModel.budgetLeft == 0) {
      // Check if budget left is zero
      const message = "You have no more budget left to add new expenses.";
      this.view.showUserFeedback(this.view.expenseInput, message, "error");
      return;
    }
    if (!this.view.checkValidation(this.view.expenseInput)) {
      const dataMaxLimitFormatted = this.view.formatNumber(
        +this.view.expenseInput.dataset.maxLimit
      );

      const dataMinLimitFormatted = this.view.formatNumber(
        +this.view.expenseInput.dataset.minLimit
      );

      const message = `Please enter a valid expense value between ${dataMinLimitFormatted} and ${dataMaxLimitFormatted}.`;

      this.view.showUserFeedback(this.view.expenseInput, message, "error");
    } else {
      const expenseObject = {
        id: this.expensesModel.expensesArray.length + 1,
        name: this.view.expenseCategoryDropdown.value,
        value: +this.view.expenseInput.value,
        color:
          this.view.expenseCategoryDropdown.options[
            this.view.expenseCategoryDropdown.selectedIndex
          ].dataset.badgeColor,
      };

      // Show user feedback
      const formattedExpenseValue = this.view.formatNumber(
        +this.view.expenseInput.value
      );
      const message = `Successfully added an expense "${expenseObject.name}" for ${formattedExpenseValue}.`;

      this.view.showUserFeedback(this.view.expenseInput, message, "success");

      this.expensesModel.setExpenses(expenseObject);
      this.budgetModel.setBudget(
        this.budgetModel.totalBudget,
        this.expensesModel.expensesTotalValue
      );
      this.view.updateUI(
        this.budgetModel.totalBudget,
        this.budgetModel.budgetLeft,
        this.expensesModel.expensesTotalValue,
        this.expensesModel.expensesArray
      );

      // Update chart
      this.view.updateChart(this.expensesModel.expensesArray);
    }
  }

  deleteExpense(e) {
    if (e.target.classList.contains("delete-expense")) {
      const currentExpense = e.target.parentElement;
      const currentExpenseId = currentExpense.id;
      const currentExpenseValue = +currentExpense.dataset.value;

      // Update the expense array, update budget left and total expenses, re-render expenses list

      // Update the expenses array
      this.expensesModel.expensesArray.splice(currentExpenseId, 1);

      // Update total expenses
      this.expensesModel.expensesTotalValue = currentExpenseValue;

      // Update budget left
      this.budgetModel.budgetLeft =
        this.budgetModel.totalBudget - this.expensesModel.expensesTotalValue;

      // Re-render expenses list
      this.view.renderExpensesList(this.expensesModel.expensesArray);

      // Update UI
      this.view.updateUI(
        this.budgetModel.totalBudget,
        this.budgetModel.budgetLeft,
        this.expensesModel.expensesTotalValue,
        this.expensesModel.expensesArray
      );
      // Update chart
      this.view.updateChart(this.expensesModel.expensesArray);
    }
  }
}
export default ExpensesController;
