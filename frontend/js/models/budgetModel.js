class BudgetModel {
  #totalBudget;
  #budgetLeft;
  constructor() {
    this.#totalBudget = +localStorage.getItem("user_total_budget") || 0;
    this.#budgetLeft = +localStorage.getItem("user_budget_left") || 0;
  }

  setBudget(value, totalExpensesValue) {
    this.#totalBudget = +value;
    this.#budgetLeft = this.#totalBudget - +totalExpensesValue;
    this.#setLocalStorageData();
  }

  resetBudget() {
    this.#totalBudget = 0;
    this.#budgetLeft = 0;
    this.#setLocalStorageData();
  }

  #setLocalStorageData() {
    localStorage.setItem("user_total_budget", this.#totalBudget);
    localStorage.setItem("user_budget_left", this.#budgetLeft);
  }

  get totalBudget() {
    return +this.#totalBudget;
  }
  get budgetLeft() {
    return +this.#budgetLeft;
  }
  set budgetLeft(value) {
    this.#budgetLeft = value;
    this.#setLocalStorageData();
  }
}

export default BudgetModel;
