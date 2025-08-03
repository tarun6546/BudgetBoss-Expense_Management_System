const transactionModel = require('../models/transactionModel'); // Ensure this model exists
const budgetModel = require('../models/budgetModel');
const moment = require('moment');

const getAllTransaction = async (req, res) => {
    try {
        const { frequency, selectedDate, type } = req.body;

        let dateFilter = {};

        if (frequency !== 'custom') {
            // Use predefined frequency
            dateFilter = {
                Date: {
                    $gt: moment().subtract(Number(frequency), 'd').toDate()
                }
            };
        } else if (selectedDate && selectedDate.length === 2) {
            // Use custom date range
            dateFilter = {
                Date: {
                    $gte: moment(selectedDate[0]).startOf('day').toDate(),
                    $lte: moment(selectedDate[1]).endOf('day').toDate()
                }
            };
        }

        const transactions = await transactionModel.find({
            ...dateFilter,
            userid: req.body.userid,
            ...(type !== 'all' && { type }) // Filter by type if not 'all'
        }).sort({ Date: -1 }); // Sort by date in descending order (newest first)

        res.status(200).json(transactions);



    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const deleteTransaction = async (req, res) => {
    try {
        await transactionModel.findOneAndDelete({
            _id: req.body.transactionId
        })
        res.status(200).send("Transaction deleted successfully");

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const editTransaction = async (req, res) => {
    try {
        await transactionModel.findOneAndUpdate({ _id: req.body.transactioId }, req.body.payload);
        res.status(200).send("Edit Successfully")

    } catch (error) {
        console.log(error)
        res.status(500).json(error)

    }

}

const addTransaction = async (req, res) => {
    try {
        const newTransaction = new transactionModel(req.body);
        await newTransaction.save();

        // Check for budget alerts if this is an expense
        let budgetAlert = null;
        if (req.body.type === 'expense') {
            const budget = await budgetModel.findOne({
                userid: req.body.userid,
                category: req.body.category,
                isActive: true
            });

            if (budget) {
                // Get current month expenses for this category
                const currentMonthExpenses = await transactionModel.find({
                    userid: req.body.userid,
                    category: req.body.category,
                    type: 'expense',
                    Date: {
                        $gte: moment().startOf('month').toDate(),
                        $lte: moment().endOf('month').toDate()
                    }
                });

                const totalSpent = currentMonthExpenses.reduce((acc, t) => acc + t.amount, 0);
                const percentageUsed = (totalSpent / budget.amount) * 100;

                if (totalSpent > budget.amount) {
                    budgetAlert = {
                        type: 'over_budget',
                        message: `You've exceeded your ${budget.category} budget by ₹${(totalSpent - budget.amount).toLocaleString()}`,
                        category: budget.category,
                        budgetAmount: budget.amount,
                        spentAmount: totalSpent
                    };
                } else if (percentageUsed >= 80) {
                    budgetAlert = {
                        type: 'near_limit',
                        message: `You've used ${Math.round(percentageUsed)}% of your ${budget.category} budget`,
                        category: budget.category,
                        budgetAmount: budget.amount,
                        spentAmount: totalSpent,
                        percentageUsed: Math.round(percentageUsed)
                    };
                }
            }
        }

        res.status(201).json({
            success: true,
            message: "Transaction added successfully",
            data: newTransaction,
            budgetAlert
        });

    } catch (error) {
        console.log(error);
        res.status(500).json(error);

    }
};

module.exports = {
    addTransaction,
    getAllTransaction, editTransaction,
    deleteTransaction
}; 