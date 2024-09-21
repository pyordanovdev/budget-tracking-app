import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import Chart from "chart.js/auto";

const notyf = new Notyf();
class View {
  constructor(budgetModel, expensesModel) {
    this.budgetModel = budgetModel;
    this.expensesModel = expensesModel;

    // Budget - App UI elements
    this.budgetInput = document.querySelector(".budget-input");
    this.btnSubmitBudget = document.querySelector(".submit-budget");
    this.btnResetBudget = document.querySelector(".reset-budget");
    this.totalBudgetLeftAmount = document.querySelector(
      ".total-budget-left-amount"
    );
    this.totalBudgetAmountValues = document.querySelectorAll(
      ".total-budget-amount"
    );
    // Expenses - App UI elements
    this.expenseInput = document.querySelector(".expense-value");
    this.btnAddExpense = document.querySelector(".submit-expense");
    this.totalExpensesAmount = document.querySelector(".total-expenses-amount");
    this.expenseCategoryDropdown = document.querySelector(
      ".expense-categories"
    );
    this.expensesListWrapper = document.querySelector(".expenses-list");

    // Expenses Chart
    this.ctx = document.querySelector("#expenses-chart").getContext("2d");
    this.expensesChartWrapper = document.querySelector(
      ".expenses-chart-wrapper-box"
    );

    this.chart = new Chart(this.ctx, {
      type: "doughnut",
      data: {
        labels: [],
        datasets: [
          {
            label: "Expenses",
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });

    // Update UI on init
    this.updateUI(
      this.budgetModel.totalBudget,
      this.budgetModel.budgetLeft,
      this.expensesModel.expensesTotalValue,
      this.expensesModel.expensesArray
    );

    this.updateChart(this.expensesModel.expensesArray);
  }

  showUserFeedback(inputElement, message, type) {
    type === "success"
      ? notyf.success(message)
      : notyf.error(message) && inputElement.classList.add("validation-error");
  }

  formatNumber(num) {
    return num.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  #resetInputValues() {
    this.budgetInput.value = "";
    this.budgetInput.classList.remove("validation-error");
    this.expenseInput.value = "";
    this.expenseInput.classList.remove("validation-error");
  }

  updateUI(totalBudget, budgetLeft, expensesTotal, expensesArray) {
    // Set budget values
    this.updateBudgetValues(totalBudget, budgetLeft);

    // Set expense values
    this.updateExpenseValues(expensesTotal);
    this.renderExpensesList(expensesArray);

    // Reset input values
    this.#resetInputValues();
    this.addMinMaxLimitExpenseInput(totalBudget, expensesTotal);
  }

  updateBudgetValues(totalBudget, budgetLeft) {
    this.totalBudgetAmountValues.forEach((item) => {
      const formattedBudget = this.formatNumber(totalBudget);
      item.textContent = formattedBudget;
    });

    this.totalBudgetLeftAmount.textContent = this.formatNumber(budgetLeft);
  }
  updateExpenseValues(totalExpenses) {
    this.totalExpensesAmount.textContent = this.formatNumber(totalExpenses);
  }

  addMinMaxLimitExpenseInput(budgetTotal, expensesTotal) {
    this.expenseInput.dataset.maxLimit = budgetTotal - expensesTotal;
    this.expenseInput.dataset.minLimit = 1;
  }

  renderExpensesList(expensesArray) {
    if (expensesArray.length) {
      this.expensesListWrapper.innerHTML = `
      ${expensesArray
        .map((item, index) => {
          return `<li class="single-expense-item" id="${index}" data-value="${
            item.value
          }" data-name="${item.name}">
            <span class="expense-badge ${item.color}">${item.name}</span>
            <span class="expense-amount">${this.formatNumber(item.value)}</span>
            <span class="delete-expense">X</span>
          </li>`;
        })
        .join("")}
      `;
    } else {
      this.expensesListWrapper.innerHTML = `<p>No expenses added yet. <br/>Add your first one.</p>`;
    }
  }

  checkValidation(inputElement) {
    const dataMaxLimit = inputElement.dataset.maxLimit;
    const dataMinLimit = inputElement.dataset.minLimit;
    const inputValue = +inputElement.value;

    if (inputValue > dataMaxLimit || inputValue < dataMinLimit) return false;
    else return true;
  }

  updateChart(expensesArray) {
    if (expensesArray) {
      // Reset values
      this.expensesChartWrapper.innerHTML = "";
      this.chart.data.labels = [];
      this.chart.data.datasets[0].data = [];
      this.chart.data.datasets[0].backgroundColor = [];
      this.chart.data.datasets[0].borderColor = [];

      // Update values
      expensesArray.forEach((expense) => {
        if (this.chart.data.labels.includes(expense.name)) {
          const index = this.chart.data.labels.indexOf(expense.name);
          this.chart.data.datasets[0].data[index] += expense.value;
        } else {
          this.chart.data.labels.push(expense.name);
          this.chart.data.datasets[0].data.push(expense.value);
        }

        // Add colors
        this.chart.data.datasets[0].backgroundColor.push(expense.color);
        this.chart.data.datasets[0].borderColor.push(`${expense.color}50`);
      });

      if (expensesArray.length === 0)
        this.expensesChartWrapper.innerHTML = `<p>No expenses added yet.<br/> Add your expense to see the chart.</p>`;
    }

    this.chart.update();
  }
}
export default View;
