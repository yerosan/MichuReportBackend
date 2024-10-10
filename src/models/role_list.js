const sequelize = require("../db/db");  // Your existing database connection
const Sequelize = require("sequelize");

const roleListModel = sequelize.define("role_list", {
    role_Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    role: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    created_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,  // Auto-set current date on record creation
    },
}, {
    timestamps: false,  // Disable automatic createdAt/updatedAt fields
    freezeTableName: true,  // Disable Sequelize pluralization of table names
});

module.exports = roleListModel;
