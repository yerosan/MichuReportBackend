const sequelize = require("../db/db");  // Your existing database connection
const Sequelize = require("sequelize");

const userInfoModel = sequelize.define("user_info", {
    userId: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
    },
    full_Name: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    userName: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    district: {
        type: Sequelize.STRING(255),
        allowNull: true,  // Allow null if not mandatory
    },
    branch: {
        type: Sequelize.UUID,
        allowNull: true,  // Allow null if not mandatory
    },
    role: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    ccreatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,  // Default value as current timestamp
    },
}, {
    timestamps: false,  // Disable automatic createdAt/updatedAt fields
});

module.exports = userInfoModel;
