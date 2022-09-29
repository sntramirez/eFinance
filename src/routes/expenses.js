const express = require("express");
const checkAuth = require ("../middleware/check-auth");
const ExpenseController = require('../controllers/expense')
const router = express.Router();

/**
 * API routes for incomes
 */
router.post('', checkAuth, ExpenseController.createExpense);
router.get('', checkAuth, ExpenseController.retrieveExpenses);

module.exports = router;