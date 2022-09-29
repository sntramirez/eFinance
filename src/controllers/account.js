const Account = require('../models/account');

/**
 * Creates account
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.createAccount = (req, res, next) => {
    const account = new Account({
        name: req.body.name,
        color: req.body.color,
        amount: req.body.amount,
        category: req.body.category_id,
        creator: req.userData.userId ? req.userData.userId : null
    });
    account.save().then(income => {
        res.status(201).json({
            account: {
                ... account,
                id: account._id,
            }
        });
    }).catch( err => {
        res.status(500).json({
            message: err.message
        })
    });
}

/**
 * Retrieves all accounts
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.retrieveAccounts = (req, res, next) => {
    const pageSize = + req.query.pageSize;
    const currentPage = + req.query.page;
    const accountQuery = Account.find();
    let fetchedAccounts;
    if (currentPage && pageSize) {
       accountQuery.skip(pageSize *(currentPage - 1)).limit(pageSize);
    }
   accountQuery.then( documents => {
        fetchedAccounts = documents;
        return Account.count();
    }).then(count => {
        res.status(200).json({
            accountCategories: fetchedAccounts,
            maxAccounts: count
        });
    }).catch(err => {
        res.status(500).json({
            message: err.message
        });
    });
}