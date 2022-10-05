const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Payment = sequelize.define('payment', {
    order_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        // type: Sequelize.INTEGER(6).ZEROFILL,
        // autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },

    status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
});

module.exports = Payment;
