const sequelize = require("../db/db");  // Your existing database connection
const Sequelize = require("sequelize");

const conversionCustomerModel = sequelize.define("conversioncustomer", {
    ConversionId: {
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
    Saving_Account: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    collected_Amount: {
        type: Sequelize.DECIMAL(10, 0),
        allowNull: false,
    },
    Amount_borrowed_Again: {
        type: Sequelize.DECIMAL(10, 0),
        allowNull: false,
    },
    Remark: {
        type: Sequelize.STRING(255),
        allowNull: true,
    },
    Collection_date: {
        type: Sequelize.DATE,
        allowNull: false,
    },
}, {
    timestamps: false,  // Disable automatic createdAt/updatedAt fields
    freezeTableName: true,  // Prevent Sequelize from pluralizing the table name
});

module.exports = conversionCustomerModel;
