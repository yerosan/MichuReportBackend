const Sequelize=require("sequelize")
const dotenv=require("dotenv")
dotenv.config()
const dbSequelize=new Sequelize(
    "michu_dashBoard",
    process.env.db_userName,
    process.env.db_password,
    {
     dialect:"mysql",
     host:"localhost",
     logging: false,
     port: 3306,
     dialectOptions: {
       connectTimeout: 60000, // 60 seconds
     },
    }

)

module.exports=dbSequelize