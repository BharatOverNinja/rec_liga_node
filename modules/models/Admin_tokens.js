'use strict';
let sequelize_mysql = require("../helpers/sequelize-mysql");
let Sequelize = require("sequelize");
const moment = require('moment');

module.exports = sequelize_mysql.define("tbl_superadmin_tokens",
    {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        i_admin_id: {
            type: Sequelize.INTEGER,            
        },
        v_token: {
            type: Sequelize.STRING,            
        },
        expire_time: {
            type: Sequelize.DATE,
            defaultValue: ()=>moment().add(2, 'hours').format('YYYY-MM-DD HH:mm:ss')
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
        tableName: 'tbl_superadmin_tokens'
    }
);


