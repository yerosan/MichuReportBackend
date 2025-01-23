const sequelize = require("../db/db");  // Your existing database connection
const Sequelize = require("sequelize");

const ineligibleKiyya_customer = sequelize.define("ineligible_kiyya_customer", {
    kiyya_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,  // Correct usage
        primaryKey: true,
        allowNull: false,
    },
    userId: {
        type: Sequelize.STRING(36),
        allowNull: false,
    },
    fullName: {
        type: Sequelize.STRING(255),
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
    customer_ident_type: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    gender: {
        type: Sequelize.ENUM('Male', 'Female'),
        allowNull: false,
    },
    marital_status: {
        type: Sequelize.ENUM('Unmarried', 'Married', 'Divorced', 'Widowed'),
        allowNull: false,
    },
    date_of_birth: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    region: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    zone_subcity: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    woreda: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    educational_level: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    economic_sector: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    line_of_business: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    initial_working_capital: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
    },
    source_of_initial_capital: {
        type: Sequelize.STRING(100),
        allowNull: false,
    },
    daily_sales: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
    },
    purpose_of_loan: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    registered_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,  // Auto-set current timestamp
    },
}, {
    timestamps: false,  // Disable automatic createdAt/updatedAt fields
    freezeTableName: true,  // Disable Sequelize pluralization of table names
});

module.exports = ineligibleKiyya_customer;
