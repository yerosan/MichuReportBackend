const sequelize = require("../db/db");  // Your existing database connection
const Sequelize = require("sequelize");

const branchCustomerModel = sequelize.define("branchcustomer", {
    uniqueId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    userId: {
        type: Sequelize.UUID,
        allowNull: false,
    },
    fullName: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    Product_Type: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    phoneNumber: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    TIN_Number: {
        type: Sequelize.STRING(255),
        allowNull: true,
    },
    Saving_Account: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    disbursed_Amount: {
        type: Sequelize.DECIMAL(10, 0),
        allowNull: false,
    },
    Region: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    zone: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    Woreda: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    Specific_Area: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    Line_of_Business: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    Purpose_of_Loan: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    Staff_Name: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    Remark: {
        type: Sequelize.STRING(255),
        allowNull: true,
    },
    Disbursed_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,  // Auto-set current timestamp
    },
}, {
    timestamps: false,  // Disable automatic createdAt/updatedAt fields
    freezeTableName: true,  // Prevent Sequelize from pluralizing the table name
});

module.exports = branchCustomerModel;
