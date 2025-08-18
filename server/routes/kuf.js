const express = require('express');
const router = express.Router();
const { getKufData } = require('../controllers/kuf');
const { extractPurchaseInvoice } = require("../services/kufExtractor.js");

(async () => {
    const result = await extractPurchaseInvoice("uploads/invoice1.pdf");
    console.log("✅ Extracted Invoice Data:", result);
})();


router.get('/kuf-data', getKufData);

module.exports = router;
