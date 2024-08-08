'use strict';
let sequelize_mysql = require("../helpers/sequelize-mysql");
let Sequelize = require("sequelize");

module.exports = sequelize_mysql.define("admin",
    {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name : {
            type: Sequelize.STRING,            
        },
        email : {
            type: Sequelize.STRING,            
        },
        password : {
            type: Sequelize.STRING,            
        },
        email_verified  : {
            type: Sequelize.BOOLEAN,
        },
        otp : {
            type: Sequelize.INTEGER,
        },
        status : {
            type: Sequelize.INTEGER
        },
        device_type  : {
            type: Sequelize.STRING,
        },
        device_token : {
            type: Sequelize.STRING,
        },
        token : {
            type: Sequelize.STRING,
        },
        created_at: {
            type: Sequelize.DATE,
            defaultValue: ()=>new Date()
        },
        updated_at: {
            type: Sequelize.DATE,
            defaultValue: null
        }
    },
    {
        freezeTableName: true,
        tableName: 'admin'
    }
);


