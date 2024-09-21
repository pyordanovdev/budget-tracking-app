"use strict";

class BudgetApp {
  constructor() {
    this.totalExpenses = +localStorage.getItem("user_total_expenses") || 0;
    this.totalBudget = +localStorage.getItem("user_total_budget") || 0;
    this.budgetLeft = +localStorage.getItem("user_budget_left") || 0;
    this.expensesArray =
      JSON.parse(localStorage.getItem("user_expenses")) || [];

    // Budget - App UI elements

    this.totalBudgetAmountValues = document.querySelectorAll(
      ".total-budget-amount"
    );
    this.budgetInput = document.querySelector(".budget-input");
    this.btnSubmitBudget = document.querySelector(".submit-budget");
    this.totalBudgetLeftAmount = document.querySelector(
      ".total-budget-left-amount"
    );

    this.btnResetBudget = document.querySelector(".reset-budget");

    // Expense - App UI elements

    this.expenseInput = document.querySelector(".expense-value");
    this.btnSubmitExpense = document.querySelector(".submit-expense");
    this.totalExpensesAmount = document.querySelector(".total-expenses-amount");

    // // Chart - App UI elements

    // this.chartCanvas = document.getElementById("expenses-chart");

    this.updateUI();
    this.eventHandlers();
  }

  resetGlobalValues() {
    this.totalExpenses = 0;
    this.totalBudget = 0;
    this.budgetLeft = 0;
    this.expensesArray = [];
  }

  eventHandlers() {
    this.btnSubmitBudget.addEventListener("click", (e) => {
      e.preventDefault();
      this.resetBudgetExpenses();
      this.submitBudget();
      this.updateUI();
    });

    this.btnSubmitExpense.addEventListener("click", (e) => {
      e.preventDefault();
      this.addExpense();
      this.setLocalStorageData();
      this.updateUI();
    });
    this.btnResetBudget.addEventListener("click", (e) => {
      e.preventDefault();
      this.resetBudgetExpenses();
      this.updateUI();
    });

    this.addEventListenersDeleteExpense();
  }
  getData() {}

  addEventListenersDeleteExpense() {
    const allBtnDeleteExpense = document.querySelectorAll(".delete-expense");
    allBtnDeleteExpense.forEach((item) => {
      item.addEventListener("click", (e) => {
        this.deleteExpense(item);
        this.setLocalStorageData();
        this.updateUI();
      });
    });
  }

  updateUI() {
    // Update Budget

    this.totalBudgetAmountValues.forEach(
      (item) => (item.textContent = this.totalBudget)
    );

    this.totalBudgetLeftAmount.textContent = this.budgetLeft;

    // Update Expenses
    this.totalExpensesAmount.textContent = this.totalExpenses;
    this.renderExpensesList();

    // Reset Input Values

    this.budgetInput.classList.remove("validation-error");
    this.expenseInput.classList.remove("validation-error");
    this.expenseInput.value = "";
    this.budgetInput.value = "";

    // Set Expense Data Max Limit Value

    this.expenseInput.dataset.maxLimit = this.budgetLeft;

    // Chart - Expenses Update

    // this.updateChart();

    // Console Log

    console.log("UI updated");
    console.log(`Total budget: ${this.totalBudget}\n`);
    console.log(`Total expenses: ${this.totalExpenses}\n`);
    console.log(`Budget left: ${this.budgetLeft}\n`);
    console.log("-------------------------------\n");
  }
  submitBudget() {
    const budgetValue = +this.budgetInput.value;

    if (!this.checkValidation(this.budgetInput)) {
      const budgetMaxLimit = this.budgetInput.dataset.maxLimit;
      const budgetMinLimit = this.budgetInput.dataset.minLimit;

      return alert(
        `Please enter a valid budget between ${budgetMinLimit} and ${budgetMaxLimit}.`
      );
    }

    this.budgetLeft = budgetValue;
    this.totalBudget = budgetValue;

    this.setLocalStorageData();
  }

  setLocalStorageData() {
    localStorage.setItem("user_total_budget", this.totalBudget);
    localStorage.setItem("user_budget_left", this.budgetLeft);
    localStorage.setItem("user_expenses", JSON.stringify(this.expensesArray));
    localStorage.setItem("user_total_expenses", this.totalExpenses);
  }
  resetBudgetExpenses() {
    this.resetGlobalValues();
    this.setLocalStorageData();
  }

  checkValidation(inputElement) {
    const dataMaxLimit = inputElement.dataset.maxLimit;
    const dataMinLimit = inputElement.dataset.minLimit;
    const inputValue = +inputElement.value;

    if (inputValue > dataMaxLimit || inputValue < dataMinLimit) {
      inputElement.classList.add("validation-error");
      return false;
    }
    return true;
  }

  updateChart() {
    const data = {
      labels: ["Red", "Blue", "Yellow"],
      datasets: [
        {
          label: "My First Dataset",
          data: [300, 50, 100],
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
          ],
          hoverOffset: 4,
        },
      ],
    };
    const chartObject = new Chart(this.chartCanvas, {
      type: "doughnut",
      data: data,
    });
  }
  // Add expense
  addExpense() {
    if (this.totalBudget === 0) {
      this.budgetInput.focus();
      return alert("Please set your budget first.");
    }

    const dataMaxLimit = this.expenseInput.dataset.maxLimit;
    const dataMinLimit = this.expenseInput.dataset.minLimit;

    if (!this.checkValidation(this.expenseInput)) {
      return alert(
        `Please enter a valid expense value no more than your budget left - $${dataMaxLimit}.`
      );
    }

    const expenseCategoriesDropdown = document.querySelector(
      ".expense-categories"
    );

    const expenseName = expenseCategoriesDropdown.value;
    const expenseInputValue = +this.expenseInput.value;
    const expenseFormatedValue = expenseInputValue;
    const expenseBadgeColor =
      expenseCategoriesDropdown.options[expenseCategoriesDropdown.selectedIndex]
        .dataset.badgeColor;

    const expenseObject = {
      id: this.expensesArray.length + 1,
      name: expenseName,
      value: expenseFormatedValue,
      badgeColor: expenseBadgeColor,
    };
    this.expensesArray.push(expenseObject);

    localStorage.setItem("user_expenses", JSON.stringify(this.expensesArray));

    this.budgetLeft -= expenseInputValue;
    this.totalExpenses += expenseInputValue;
  }
  deleteExpense(item) {
    const currentExpenseItem = item.parentElement;
    const id = +currentExpenseItem.id;
    const expenseValue = this.expensesArray[id].value;
    console.log(this.expensesArray[id]);

    this.expensesArray.splice(id, 1);
    console.log(expenseValue, typeof expenseValue);

    this.totalExpenses -= expenseValue;
    this.budgetLeft += expenseValue;

    localStorage.setItem("user_expenses", JSON.stringify(this.expensesArray));
  }

  // Render expenses method
  renderExpensesList() {
    const expenses = JSON.parse(localStorage.getItem("user_expenses"));
    const expensesListWrapperDOM = document.querySelector(
      ".expenses-list-wrapper"
    );

    if (expenses && expenses.length > 0) {
      expensesListWrapperDOM.innerHTML = `
      <ul class="expenses-list">
        ${expenses
          .map((item, index) => {
            return `<li class="single-expense-item" id="${index}">
            <span class="expense-badge ${item.badgeColor}">${item.name}</span>
            <span class="expense-amount">${this.formatNumber(item.value)}</span>
            <span class="delete-expense">X</span>
          </li>`;
          })
          .join("")}
          </ul>
          `;
      this.addEventListenersDeleteExpense();
    } else {
      expensesListWrapperDOM.innerHTML = `<p>No expenses added yet. Add your first one.</p>`;
    }
  }

  formatNumber(num) {
    return "$" + num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  }
}

document.addEventListener("DOMContentLoaded", (e) => {
  const budgetApp = new BudgetApp();
});
