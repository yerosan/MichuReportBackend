const sequelize = require("../db/db");  // Your existing database connection
const Sequelize = require("sequelize");

const districtListModel = sequelize.define("district_list", {
    dis_Id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
    },
    district_name: {
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

module.exports = districtListModel;
