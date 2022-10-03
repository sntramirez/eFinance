const mongoose = require('mongoose');

/**
 * Expenses model
 */
const expenseSchema = mongoose.Schema({
  title: {type: String, required: true},
  description: { type: String, required: true},
  amount: {type: Number, required: true},
  category: {type: mongoose.Types.ObjectId, ref:"ExpenseCategory" , required:false},
  date: {type: Date, default: Date.now() + 7*24*60*60*1000, required: true},
  creator: {type: mongoose.Types.ObjectId, ref:"User" , required: true}
});

module.exports = mongoose.model('Exprense', expenseSchema)