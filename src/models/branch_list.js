const sequelize = require("../db/db");  // Your existing database connection
const Sequelize = require("sequelize");

const branchListModel = sequelize.define("branch_list", {
    dis_Id: {
        type: Sequelize.UUID,
        allowNull: false,
    },
    branch_code: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
    },
    branch_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    created_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,  // Auto-set current date by default
    },
}, {
    timestamps: false,  // Disable automatic createdAt/updatedAt fields
    freezeTableName: true,  // Disable Sequelize pluralization of table names
});

module.exports = branchListModel;
