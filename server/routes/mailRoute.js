const express = require("express");
const sendEmail = require("../services/mailService");
const router = express.Router();

router.get("/send-test-email", async (req, res) => {
    try {
        await sendEmail({
            to: "filip.ljoljic@symphony.is",
            subject: "Test Email from Node",
            text: "This is my text message: Hello world!",
            html: "<b>Hello world!</b>",
        });
        res.send("Email sent successfully");
    } catch (error) {
        res.status(500).send("Error sending email");
    }
});

module.exports = router;
