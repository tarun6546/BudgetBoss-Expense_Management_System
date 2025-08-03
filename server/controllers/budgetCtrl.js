const budgetModel = require('../models/budgetModel');
const transactionModel = require('../models/transactionModel');
const moment = require('moment');

// Add budget
const addBudget = async (req, res) => {
  try {
    const newBudget = new budgetModel(req.body);
    await newBudget.save();
    res.status(201).json({
      success: true,
      message: "Budget added successfully",
      data: newBudget
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// Get all budgets for a user
const getAllBudgets = async (req, res) => {
  try {
    const { userid } = req.body;
    const budgets = await budgetModel.find({ userid, isActive: true });
    res.status(200).json(budgets);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// Update budget
const updateBudget = async (req, res) => {
  try {
    const { budgetId, payload } = req.body;
    const updatedBudget = await budgetModel.findByIdAndUpdate(
      budgetId,
      payload,
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Budget updated successfully",
      data: updatedBudget
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// Delete budget
const deleteBudget = async (req, res) => {
  try {
    const { budgetId } = req.body;
    await budgetModel.findByIdAndDelete(budgetId);
    res.status(200).send("Budget deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// Get budget status and alerts
const getBudgetStatus = async (req, res) => {
  try {
    const { userid } = req.body;
    const currentMonth = moment().format('YYYY-MM');
    
    // Get all active budgets
    const budgets = await budgetModel.find({ userid, isActive: true });
    
    // Get current month transactions
    const transactions = await transactionModel.find({
      userid,
      type: 'expense',
      Date: {
        $gte: moment().startOf('month').toDate(),
        $lte: moment().endOf('month').toDate()
      }
    });

    // Calculate spending by category
    const spendingByCategory = {};
    transactions.forEach(transaction => {
      if (!spendingByCategory[transaction.category]) {
        spendingByCategory[transaction.category] = 0;
      }
      spendingByCategory[transaction.category] += transaction.amount;
    });

    // Compare with budgets and generate alerts
    const budgetStatus = budgets.map(budget => {
      const spent = spendingByCategory[budget.category] || 0;
      const remaining = budget.amount - spent;
      const percentageUsed = (spent / budget.amount) * 100;
      
      return {
        _id: budget._id,
        category: budget.category,
        budgetAmount: budget.amount,
        spentAmount: spent,
        remainingAmount: remaining,
        percentageUsed: Math.round(percentageUsed),
        isOverBudget: spent > budget.amount,
        isNearLimit: percentageUsed >= 80 && percentageUsed < 100,
        period: budget.period,
        description: budget.description
      };
    });

    // Get overall budget summary
    const totalBudget = budgets.reduce((acc, budget) => acc + budget.amount, 0);
    const totalSpent = Object.values(spendingByCategory).reduce((acc, spent) => acc + spent, 0);
    const overallRemaining = totalBudget - totalSpent;
    const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    res.status(200).json({
      budgetStatus,
      summary: {
        totalBudget,
        totalSpent,
        overallRemaining,
        overallPercentage: Math.round(overallPercentage),
        isOverBudget: totalSpent > totalBudget,
        isNearLimit: overallPercentage >= 80 && overallPercentage < 100
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// Get dashboard data with budget alerts
const getDashboardData = async (req, res) => {
  try {
    const { userid } = req.body;
    const currentMonth = moment().format('YYYY-MM');
    
    // Get transactions for current month
    const transactions = await transactionModel.find({
      userid,
      Date: {
        $gte: moment().startOf('month').toDate(),
        $lte: moment().endOf('month').toDate()
      }
    });

    // Calculate basic statistics
    const income = transactions.filter(t => t.type === 'income');
    const expenses = transactions.filter(t => t.type === 'expense');
    
    const totalIncome = income.reduce((acc, t) => acc + t.amount, 0);
    const totalExpenses = expenses.reduce((acc, t) => acc + t.amount, 0);
    const netBalance = totalIncome - totalExpenses;

    // Get budget status
    const budgets = await budgetModel.find({ userid, isActive: true });
    const spendingByCategory = {};
    expenses.forEach(transaction => {
      if (!spendingByCategory[transaction.category]) {
        spendingByCategory[transaction.category] = 0;
      }
      spendingByCategory[transaction.category] += transaction.amount;
    });

    // Generate budget alerts
    const budgetAlerts = [];
    budgets.forEach(budget => {
      const spent = spendingByCategory[budget.category] || 0;
      const percentageUsed = (spent / budget.amount) * 100;
      
      if (spent > budget.amount) {
        budgetAlerts.push({
          type: 'over_budget',
          category: budget.category,
          budgetAmount: budget.amount,
          spentAmount: spent,
          message: `You've exceeded your ${budget.category} budget by ₹${(spent - budget.amount).toLocaleString()}`
        });
      } else if (percentageUsed >= 80) {
        budgetAlerts.push({
          type: 'near_limit',
          category: budget.category,
          budgetAmount: budget.amount,
          spentAmount: spent,
          percentageUsed: Math.round(percentageUsed),
          message: `You've used ${Math.round(percentageUsed)}% of your ${budget.category} budget`
        });
      }
    });

    // Calculate percentages
    const totalAmount = totalIncome + totalExpenses;
    const incomePercentage = totalAmount > 0 ? (totalIncome / totalAmount) * 100 : 0;
    const expensePercentage = totalAmount > 0 ? (totalExpenses / totalAmount) * 100 : 0;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    res.status(200).json({
      statistics: {
        totalBalance: netBalance,
        monthlyIncome: totalIncome,
        monthlyExpenses: totalExpenses,
        totalTransactions: transactions.length,
        incomePercentage: Math.round(incomePercentage),
        expensePercentage: Math.round(expensePercentage),
        savingsRate: Math.round(savingsRate)
      },
      budgetAlerts,
      transactions
    });

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  addBudget,
  getAllBudgets,
  updateBudget,
  deleteBudget,
  getBudgetStatus,
  getDashboardData
}; 