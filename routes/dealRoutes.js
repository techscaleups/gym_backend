const express = require('express');
const router = express.Router();
const dealController = require('../controllers/dealController');

router.post('/create', dealController.createDeal); // POST with base64 image
router.get('/current', dealController.getDealOfTheDay); // GET current deal

module.exports = router;
