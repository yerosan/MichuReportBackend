const sequelize = require("../db/db");  
const Sequelize = require("sequelize");

const nationalData= sequelize.define("nationaldata", {
    nationalId: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
    },
    id:{
        type: Sequelize.STRING,
        allowNull:"true"

    },
    customerPhone:{
        type: Sequelize.STRING,
        allowNull:"false"
    },
    version:{
        type: Sequelize.STRING,
        allowNull:"true"
    },
    transactionID:{
        type:  Sequelize.STRING,
        allowNull:"true"
    },
    name:{
        type: Sequelize.STRING,
        allowNull:"true"
    },
    dob:{
        type: Sequelize.STRING,
        allowNull:"true"
    },
    gender:{
        type: Sequelize.STRING,
        allowNull:"true"
    },
    phoneNumber:{
        type: Sequelize.STRING,
        allowNull:"true"
    },
    email:{
        type: Sequelize.STRING,
        allowNull:"true"
    },
    fullAddress:{
        type: Sequelize.STRING(255),
        allowNull:"true"
    },
    responseTime:{
        type: Sequelize.STRING(255),
        allowNull: true,
    }
}, 
{
    timestamps: false,  // Disable automatic createdAt/updatedAt fields
    freezeTableName: true,  // Disable Sequelize pluralization of table names
}
);