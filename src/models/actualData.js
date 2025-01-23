const sequelize = require("../db/db");  
const Sequelize = require("sequelize");

const actualDataModel = sequelize.define("actualdata", {
    actual_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    branch_code: {
        type: Sequelize.UUID,
        allowNull: false,
    },
    customer_number: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    customer_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    saving_account: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    disbursed_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
    },
    disbursed_date: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    upload_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,  // Automatically set the current timestamp
    },
}, {
    timestamps: false,  // Disable automatic createdAt/updatedAt fields
    freezeTableName: true,  // Disable Sequelize pluralization of table names
});

module.exports = actualDataModel;
