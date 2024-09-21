class BudgetController {
  constructor(view, budgetModel, expensesModel) {
    // this.budgetModel = new BudgetModel();
    this.view = view;
    this.budgetModel = budgetModel;
    this.expensesModel = expensesModel;

    this.addEventListeners();
  }

  addEventListeners() {
    this.view.btnResetBudget.addEventListener(
      "click",
      this.resetBudget.bind(this)
    );
    this.view.btnSubmitBudget.addEventListener(
      "click",
      this.submitBudget.bind(this)
    );
  }

  submitBudget() {
    // Check if input is valid
    if (!this.view.checkValidation(this.view.budgetInput)) {
      const dataMaxLimitFormatted = this.view.formatNumber(
        +this.view.budgetInput.dataset.maxLimit
      );
      const dataMinLimitFormatted = this.view.formatNumber(
        +this.view.budgetInput.dataset.minLimit
      );
      const message = `Please enter a valid budget between ${dataMinLimitFormatted} and ${dataMaxLimitFormatted}.`;

      this.view.showUserFeedback(this.view.budgetInput, message, "error");
    } else {
      const budgetInputValue = +this.view.budgetInput.value;

      // Reset expenses
      this.expensesModel.resetExpenses();

      // Set new budget
      this.budgetModel.setBudget(
        budgetInputValue,
        this.expensesModel.expensesTotalValue
      );

      // Show user feedback
      const formattedBudget = this.view.formatNumber(budgetInputValue);
      const message = `Successfully added a budget of ${formattedBudget}.`;

      this.view.showUserFeedback(this.view.budgetInput, message, "success");

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

  resetBudget() {
    // Reset budget and expenses
    this.budgetModel.resetBudget();
    this.expensesModel.resetExpenses();

    // Update UI
    this.view.updateUI(
      this.budgetModel.totalBudget,
      this.budgetModel.budgetLeft,
      this.expensesModel.expensesTotalValue,
      this.expensesModel.expensesArray
    );

    // Update chart
    this.view.updateChart(this.expensesModel.expensesArray);

    // Show user feedback
    this.view.showUserFeedback(
      this.view.budgetInput,
      "Budget has been reset!",
      "success"
    );
  }
}

export default BudgetController;
