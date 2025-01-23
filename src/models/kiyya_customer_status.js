// CREATE TABLE kiyya_customer_status (
//     status_id CHAR(36) PRIMARY KEY NOT NULL DEFAULT (UUID()),
//     userId VARCHAR(36),
//     phone_number VARCHAR(36),
//     account_number VARCHAR(36),
//     total_score DECIMAL(15, 2),
//     eligible VARCHAR(100),
//     registered_date TIMESTAMP
// );


const sequelize = require("../db/db");  // Your existing database connection
const Sequelize = require("sequelize");

const kiyyaCustomerStatus = sequelize.define("kiyya_customer_status", {
    status_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,  // Correct usage
        primaryKey: true,
        allowNull: false,
    },
    userId: {
        type: Sequelize.STRING(36),
        allowNull: false,
    },
    phone_number: {
        type: Sequelize.STRING(36),
        allowNull: false,
    },
    account_number: {
        type: Sequelize.STRING(36),
        allowNull: false,
    },
    total_score: {
        type: Sequelize.DECIMAL,
        allowNull: false,
    },
    eligible: {
        type: Sequelize.STRING(100),
        allowNull: false,
    },
    registered_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,  // Auto-set current timestamp
    },
});

module.exports = kiyyaCustomerStatus;