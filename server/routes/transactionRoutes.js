const { addTransaction, getAllTransaction,editTransaction,deleteTransaction } = require('../controllers/transactionCtrl');
const express = require('express');





//router object
const router = express.Router();

//routes
//add transaction post method
router.post('/add-transaction', addTransaction);
//edit transaction post method
router.post('/edit-transaction', editTransaction);

//delete transaction post method
router.post('/delete-transaction', deleteTransaction);
//get all transactions get method
router.post('/get-transactions', getAllTransaction);

module.exports = router;