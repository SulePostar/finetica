const faqService = require('../services/faqService');

exports.getFaqs = async (req, res) => {
    try {
        const faqs = await faqService.getAllFaqs();
        return res.status(200).json(faqs);
    } catch (error) {
        console.error("Controller Error - getFaqs:", error);
        return res.status(500).json({
            message: "An error occurred while retrieving help content."
        });
    }
};