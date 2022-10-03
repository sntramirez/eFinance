const Expense = require('../models/expense');

/**
 * Creates an income
 * @param {*} req request
 * @param {*} res response
 * @param {*} next 
 */
exports.createExpense= (req, res, next) => {
    // const url = req.protocol + "://" + req.get("host"); 
    const expense = new Expense({
        title: req.body.title,
        description: req.body.description,
        amount: req.body.amount,
        category: req.body.category_id,
        creator: req.userData.userId
    });
    expense.save().then(income => {
        res.status(201).json({
            expense: {
                ... expense,
                id: expense._id,
            }
        });
    }).catch( err => {
        res.status(500).json({
            message: err.message
        })
    });
};

/**
 * Retrieves expenses since the beginning of the month
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next
 */
exports.retrieveExpenses = (req, res, next) => {
    const today = new Date();
    const monthBeginning = new Date(today.getFullYear(), today.getMonth(), 1);

    const pageSize = + req.query.pageSize;
    const currentPage = + req.query.page;
    const expenseQuery = Expense.find({creator: req.userData.userId, $lt: monthBeginning});
    console.log(expenseQuery);
    let fetchedExpenses;
    if (currentPage && pageSize) {
        expenseQuery.skip(pageSize *(currentPage - 1)).limit(pageSize);
    }
    expenseQuery.then( documents => {
        fetchedExpenses = documents;
        return Expense.find({creator: req.userData.userId, $lt: monthBeginning}).count();
    }).then(count => {
        res.status(200).json({
            expenses: fetchedExpenses,
            maxExpenses: count,
            since: monthBeginning
        });
    }).catch(err => {
        res.status(500).json({
            message: err.message
        });
    });
};