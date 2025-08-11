const express = require('express');
const router = express.Router();
const { getKifData } = require('../controllers/kif');

router.get('/kif-data', getKifData);

module.exports = router;
