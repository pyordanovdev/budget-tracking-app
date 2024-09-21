class ExpensesModel {
  #totalExpensesValue;
  #expensesArray;
  constructor() {
    this.#expensesArray =
      JSON.parse(localStorage.getItem("user_expenses")) || [];
    this.#totalExpensesValue =
      +localStorage.getItem("user_total_expenses") || 0;
  }

  setExpenses(expenseObject) {
    this.#totalExpensesValue += expenseObject.value;
    this.#expensesArray.push(expenseObject);
    this.#setLocalStorageData();
  }

  resetExpenses() {
    this.#totalExpensesValue = 0;
    this.#expensesArray = [];
    this.#setLocalStorageData();
  }

  #setLocalStorageData() {
    localStorage.setItem("user_total_expenses", this.#totalExpensesValue);
    localStorage.setItem("user_expenses", JSON.stringify(this.#expensesArray));
  }

  get expensesTotalValue() {
    return +this.#totalExpensesValue;
  }
  get expensesArray() {
    return this.#expensesArray;
  }

  set expensesTotalValue(value) {
    this.#totalExpensesValue -= value;
    this.#setLocalStorageData();
  }
}

export default ExpensesModel;
