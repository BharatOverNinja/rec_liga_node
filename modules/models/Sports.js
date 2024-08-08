'use strict';
let sequelize_mysql = require("../helpers/sequelize-mysql");
let Sequelize = require("sequelize");

module.exports = sequelize_mysql.define("sports",
    {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name : {
            type: Sequelize.STRING,            
        },
        status : {
            type: Sequelize.INTEGER,            
        }
    },
    {
        freezeTableName: true,
        tableName: 'sports'
    }
);


