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

exports.deleteFaq = async (req, res, next) => {
    try {
        const faqId = req.params.id;
        const result = await faqService.deleteFaqById(faqId);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

exports.createFaq = async (req, res, next) => {
    try {
        const faqData = req.body;
        const newFaq = await faqService.createFaq(faqData);
        return res.status(201).json(newFaq);
    } catch (error) {
        next(error);
    }
};