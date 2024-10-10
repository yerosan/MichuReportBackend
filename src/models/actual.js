const sequelize = require("../db/db");  // Your existing database connection
const Sequelize = require("sequelize");

const actualModel = sequelize.define("actual", {
    actual_Id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
    },
    branch_code: {
        type: Sequelize.UUID,
        allowNull: false,
    },
    unique_actual: {
        type: Sequelize.DECIMAL(10, 0),
        allowNull: false,
    },
    account_actual: {
        type: Sequelize.DECIMAL(10, 0),
        allowNull: false,
    },
    disbursment_actual: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
    },
    actual_date: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    created_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,  // Set the current timestamp as the default
    },
}, {
    timestamps: false,  // Disable automatic createdAt/updatedAt fields
    freezeTableName: true,  // Disable Sequelize pluralization of table names
});

module.exports = actualModel;
