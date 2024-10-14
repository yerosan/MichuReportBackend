const sequelize = require("../db/db");  // Your existing database connection
const Sequelize = require("sequelize");

const customerListNonecodeModel = sequelize.define("customer_list_nonecode", {
    cust_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
    gender: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    phone_number: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    saving_account: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    business_tin: {
        type: Sequelize.STRING(255),
        allowNull: true,
    },
    application_status: {
        type: Sequelize.STRING(255),
        allowNull: true,
    },
    michu_loan_product: {
        type: Sequelize.STRING(255),
        allowNull: true,
    },
    approved_amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    approved_date: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    expiry_date: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    oustanding_total: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    arrears_start_date: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    loan_status: {
        type: Sequelize.STRING(255),
        allowNull: true,
    },
    created_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,  // Automatically set the current timestamp
    },
}, {
    timestamps: false,  // Disable automatic createdAt/updatedAt fields
    freezeTableName: true,  // Prevent Sequelize from pluralizing the table name
});

module.exports = customerListNonecodeModel;
