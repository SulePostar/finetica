'use strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('business_partners', 'deleted_at', {
            type: Sequelize.DATE,
            allowNull: true,
        });
    },

    down: async (queryInterface) => {
        await queryInterface.removeColumn('business_partners', 'deleted_at');
    },
};