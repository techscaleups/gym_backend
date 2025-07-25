const express = require('express');
const router = express.Router();
const dealController = require('../controllers/dealController');

router.post('/create', dealController.createDeal); 
router.get('/current', dealController.getDealOfTheDay);

module.exports = router;
