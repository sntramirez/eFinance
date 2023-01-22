const express = require('express');
const EstimationCategory = require('../controllers/estimationCategory');
// const checkAuth = require('../middleware/check-auth');
const router = express.Router();

/**
 * API routes for estimation categories
 */
router.post('', EstimationCategory.createEstimationCategory);
router.get('', EstimationCategory.retrieveEstimationCategories);
router.get('/:category/children', EstimationCategory.retrieveEstimationChildrenCategories);
router.delete('', EstimationCategory.deleteEstimationCategory);

module.exports = router;
