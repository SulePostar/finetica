const express = require('express');
const router = express.Router();
const { getKufData } = require('../controllers/kuf');

router.get('/kuf-data', getKufData);

module.exports = router;
