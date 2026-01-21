const { FaqItem } = require('../models');

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
}

module.exports = new FaqService();