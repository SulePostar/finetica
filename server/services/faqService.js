const { FaqItem } = require('../models');
const AppError = require('../utils/errorHandler');

class FaqService {

    async getAllFaqs() {
        return await FaqItem.findAll({
            where: {
                isActive: true
            },
            attributes: ['id', 'categoryKey', 'question', 'answer', 'displayOrder'],
            order: [
                ['categoryKey', 'ASC'],
                ['displayOrder', 'ASC']
            ]
        });
    }

    async deleteFaqById(faqId) {
        const faq = await FaqItem.findByPk(faqId);
        if (!faq) {
            throw new Error('FAQ item not found');
        }
        await faq.destroy();
        return { message: 'FAQ item deleted successfully' };
    }

    async createFaq(faqData) {
        if (!faqData.categoryKey || !faqData.question || !faqData.answer) {
            throw new Error('categoryKey, question, and answer are required to create an FAQ item');
        }
        const existingFaq = await FaqItem.findOne({
            where: {
                categoryKey: faqData.categoryKey,
                question: faqData.question
            }
        });
        if (existingFaq) {
            throw new AppError('An FAQ item with the same category and question already exists', 409);
        }
        const newFaq = await FaqItem.create({
            categoryKey: faqData.categoryKey,
            question: faqData.question,
            answer: faqData.answer,
            displayOrder: faqData.displayOrder || 0,
            isActive: faqData.isActive !== undefined ? faqData.isActive : true
        });
        return newFaq;
    }
}

module.exports = new FaqService();