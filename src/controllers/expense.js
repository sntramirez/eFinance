const Expense = require('../models/expense');

/**
 * Creates an income
 * @param {*} req request
 * @param {*} res response
 * @param {*} next 
 */
exports.createExpense= (req, res, next) => {
    const expense = new Expense({
        title: req.body.title,
        description: req.body.description,
        amount: req.body.amount,
        category: req.body.category,
        account: req.body.account,
        creator: req.userData.userId
    });
    expense.save().then(expense => {
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
    const fieldSort = req.query.sort;
    let arraySort=(fieldSort != undefined ? fieldSort : "").split("~");
    let sortJson={};
    arraySort.forEach(e=>{
        let arrayPrmSort=e.split("-");
        let sortType = arrayPrmSort[1] == "asc" ? 1:-1;
        sortJson[arrayPrmSort[0]] = sortType;
    });

    const pageSize = + req.query.pageSize;
    const currentPage = + req.query.page;
    const expenseQuery = Expense.find({creator: req.userData.userId, $lt: monthBeginning}).sort(sortJson);
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