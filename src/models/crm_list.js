const sequelize = require("../db/db");  // Your existing database connection
const Sequelize = require("sequelize");

const crmListModel = sequelize.define("crm_list", {
    employe_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
    },
    dis_Id: {
        type: Sequelize.UUID,
        allowNull: false,
    },
    full_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    department: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    sub_process: {
        type: Sequelize.STRING(255),
        allowNull: true,  // Assuming sub_process can be null
    },
    role: {
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

module.exports = crmListModel;
