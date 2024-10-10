const sequelize = require("../db/db");  // Your existing database connection
const Sequelize = require("sequelize");

const crmUserModel = sequelize.define("crm_user", {
    crm_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
    },
    employe_id: {
        type: Sequelize.UUID,
        allowNull: false,
    },
    username: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    crm_password: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    registered_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,  // Set current date by default
    },
}, {
    timestamps: false,  // Disable automatic createdAt/updatedAt fields
    freezeTableName: true,  // Disable Sequelize pluralization of table names
});

module.exports = crmUserModel;
