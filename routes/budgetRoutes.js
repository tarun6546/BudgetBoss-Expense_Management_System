const express = require('express');
const { 
  addBudget, 
  getAllBudgets, 
  updateBudget, 
  deleteBudget, 
  getBudgetStatus,
  getDashboardData 
} = require('../controllers/budgetCtrl');

const router = express.Router();

// Budget routes
router.post('/add-budget', addBudget);
router.post('/get-budgets', getAllBudgets);
router.post('/update-budget', updateBudget);
router.post('/delete-budget', deleteBudget);
router.post('/get-budget-status', getBudgetStatus);
router.post('/get-dashboard-data', getDashboardData);

module.exports = router; 