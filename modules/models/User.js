'use strict';
let sequelize_mysql = require("../helpers/sequelize-mysql");
let Sequelize = require("sequelize");

module.exports = sequelize_mysql.define("user",
    {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_name : {
            type: Sequelize.STRING,            
        },
        email : {
            type: Sequelize.STRING,            
        },
        address : {
            type: Sequelize.STRING, 
        },
        phone : {
            type: Sequelize.STRING,
        },
        country_code : {
            type: Sequelize.INTEGER,            
        },
        image : {
            type: Sequelize.STRING,            
        },
        phone_otp : {
            type: Sequelize.INTEGER         
        },
        email_otp : {
            type: Sequelize.INTEGER,
        },
        birthdate: {
            type: Sequelize.STRING,
        },
        is_phone_verified : {
            type: Sequelize.BOOLEAN,
        },
        is_email_verified  : {
            type: Sequelize.BOOLEAN,
        },
        device_type  : {
            type: Sequelize.STRING,
        },
        device_token : {
            type: Sequelize.STRING,
        },
        status : {
            type: Sequelize.INTEGER
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
        tableName: 'user'
    }
);


