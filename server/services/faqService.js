const { FaqItem } = require('../models');

class FaqService {

    async getAllFaqs() {
        return await FaqItem.findAll({
            where: {
                isActive: true // Filter for active items only
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