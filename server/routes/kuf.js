const express = require('express');
const multer = require('multer');
const path = require('path');
const { extractPurchaseInvoice } = require("../services/kufExtractor.js");
const { getKufData } = require('../controllers/kuf');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

router.post("/upload-invoice", upload.single("invoice"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const filePath = req.file.path;
        const extracted = await extractPurchaseInvoice(filePath);

        res.json({ success: true, data: extracted });
    } catch (err) {
        console.error("❌ Upload error:", err);
        res.status(500).json({ error: "Failed to process invoice" });
    }
});

router.get('/kuf-data', getKufData);

module.exports = router;
