const sequelize = require("../db/db");  // Your existing database connection
const Sequelize = require("sequelize");

const womenProductCustomerModel = sequelize.define("women_product_customer", {
    wpc_id: {
        type: Sequelize.INTEGER,  // Change UUID to INTEGER
        primaryKey: true,
        autoIncrement: true,  // Enable auto-increment
        allowNull: false
    },
    
    crm_id: {
        type: Sequelize.UUID,
        allowNull: false,
    },
    full_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    phone_number: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    account_no: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    disbursed_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
    },
    remark: {
        type: Sequelize.STRING(255),
        allowNull: true,
    },
    registered_date: {
        type: Sequelize.DATE,
        allowNull: false,
    },
}, {
    timestamps: false,  // Disable automatic createdAt/updatedAt fields
    freezeTableName: true,  // Disable Sequelize pluralization of table names
});

module.exports = womenProductCustomerModel;
