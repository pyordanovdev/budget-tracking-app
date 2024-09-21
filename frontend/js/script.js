import BudgetController from "./controllers/budgetController.js";
import ExpensesController from "./controllers/expensesController.js";
import View from "./views/View.js";
import BudgetModel from "./models/budgetModel.js";
import ExpensesModel from "./models/expensesModel.js";

document.addEventListener("DOMContentLoaded", (e) => {
  const budgetModel = new BudgetModel();
  const expensesModel = new ExpensesModel();
  const view = new View(budgetModel, expensesModel);
  const budgetController = new BudgetController(
    view,
    budgetModel,
    expensesModel
  );
  const expensesController = new ExpensesController(
    view,
    budgetModel,
    expensesModel
  );
});
